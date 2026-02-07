"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { firestoreProvider } from "@/lib/storage/firestoreProvider";
import { DEVICE_KEY, PIN_KEY } from "@/lib/pin";

type GateStatus = "loading" | "setup" | "verify" | "verified";

interface PinGateProps {
  onVerified: () => void;
}

const hashPin = async (pin: string) => {
  const cryptoApi = globalThis.crypto?.subtle;
  if (cryptoApi) {
    const data = new TextEncoder().encode(pin);
    const hashBuffer = await cryptoApi.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return sha256Hex(pin);
};

const sha256Hex = (message: string) => {
  const msg = new TextEncoder().encode(message);
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const l = msg.length * 8;
  const withOne = new Uint8Array(((msg.length + 9 + 63) >> 6) << 6);
  withOne.set(msg);
  withOne[msg.length] = 0x80;
  const view = new DataView(withOne.buffer);
  view.setUint32(withOne.length - 4, l >>> 0);
  view.setUint32(withOne.length - 8, Math.floor(l / 0x100000000));

  const w = new Uint32Array(64);
  for (let i = 0; i < withOne.length; i += 64) {
    for (let t = 0; t < 16; t += 1) {
      w[t] = view.getUint32(i + t * 4);
    }
    for (let t = 16; t < 64; t += 1) {
      const s0 =
        ((w[t - 15] >>> 7) | (w[t - 15] << 25)) ^
        ((w[t - 15] >>> 18) | (w[t - 15] << 14)) ^
        (w[t - 15] >>> 3);
      const s1 =
        ((w[t - 2] >>> 17) | (w[t - 2] << 15)) ^
        ((w[t - 2] >>> 19) | (w[t - 2] << 13)) ^
        (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];

    for (let t = 0; t < 64; t += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return H.map((value) => value.toString(16).padStart(8, "0")).join("");
};

const isValidPin = (pin: string) => /^\d{4,8}$/.test(pin);

export function PinGate({ onVerified }: PinGateProps) {
  const storage = useMemo(() => firestoreProvider(), []);
  const [status, setStatus] = useState<GateStatus>("loading");
  const [pin, setPin] = useState("");
  const [pinHash, setPinHash] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const storedHash = await storage.get(PIN_KEY);
        const localOk = window.localStorage.getItem(DEVICE_KEY) === "true";
        if (!storedHash) {
          window.localStorage.removeItem(DEVICE_KEY);
          setPinHash(null);
          setStatus("setup");
          return;
        }

        setPinHash(storedHash);
        if (localOk) {
          setStatus("verified");
          onVerified();
          return;
        }

        setStatus("verify");
      } catch {
        setError("Nao foi possivel carregar o PIN.");
        setStatus("setup");
      }
    };
    void init();
  }, [onVerified, storage]);

  const handleSubmit = async () => {
    setError("");
    if (!isValidPin(pin)) {
      setError("Use um PIN de 4 a 8 numeros.");
      return;
    }

    const hashed = await hashPin(pin);
    if (status === "setup") {
      await storage.set(PIN_KEY, hashed);
      window.localStorage.setItem(DEVICE_KEY, "true");
      setStatus("verified");
      onVerified();
      return;
    }

    if (pinHash && hashed !== pinHash) {
      setError("PIN incorreto.");
      return;
    }

    window.localStorage.setItem(DEVICE_KEY, "true");
    setStatus("verified");
    onVerified();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Carregando...
      </div>
    );
  }

  if (status === "verified") {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card-soft">
            <Lock size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold">
              {status === "setup" ? "Criar PIN" : "Entrar com PIN"}
            </p>
            <p className="text-xs text-muted">
              {status === "setup"
                ? "Defina um PIN para proteger seus dados."
                : "Informe seu PIN para acessar."}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="Digite o PIN"
            className="h-12 w-full text-center text-lg tracking-[0.35em]"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            {status === "setup" ? "Criar PIN" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
