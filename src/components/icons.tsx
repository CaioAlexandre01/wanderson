"use client";

import {
  Wallet,
  ShoppingBag,
  Car,
  Sparkles,
  Receipt,
  HeartPulse,
  CreditCard,
  PiggyBank,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Wallet,
  ShoppingBag,
  Car,
  Sparkles,
  Receipt,
  HeartPulse,
  CreditCard,
  PiggyBank,
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
};

export const getIcon = (name?: string): LucideIcon => {
  if (!name) return Wallet;
  return iconMap[name] ?? Wallet;
};








