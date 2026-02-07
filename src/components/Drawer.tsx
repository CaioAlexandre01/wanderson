"use client";

import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="h-full w-[80%] max-w-xs rounded-r-[var(--radius-card)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            {title && (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                {title}
              </p>
            )}
            <div className="mt-4 space-y-4">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}








