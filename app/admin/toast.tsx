"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

// Errors often explain what to do next ("deactivate it instead"), so they
// stay up longer. Hovering or focusing a toast pauses its timer.
const DURATION_MS: Record<ToastKind, number> = {
  success: 4000,
  info: 5000,
  error: 9000,
};
const MAX_VISIBLE = 4;

const STYLES: Record<ToastKind, { box: string; icon: string; Icon: typeof Info }> = {
  success: {
    box: "border-[#DCFCE7]",
    icon: "bg-[#EAF6EE] text-[#15803D]",
    Icon: CircleCheck,
  },
  error: {
    box: "border-[#FECDCA]",
    icon: "bg-[#FEF3F2] text-[#B42318]",
    Icon: CircleAlert,
  },
  info: {
    box: "border-[#E5EDE8]",
    icon: "bg-[#F4F7F5] text-[#3F4A44]",
    Icon: Info,
  },
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>.");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Live regions must already be in the DOM when text changes, or screen
  // readers may not announce it, so they're permanent and only their text
  // changes. Errors interrupt (assertive); everything else waits (polite).
  const [announce, setAnnounce] = useState({ polite: "", assertive: "" });
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId.current;
    setToasts((prev) => {
      // Same message already showing (e.g. a double click): don't stack it.
      const rest = prev.filter((t) => !(t.kind === kind && t.message === message));
      return [...rest, { id, kind, message }].slice(-MAX_VISIBLE);
    });
    setAnnounce((prev) =>
      kind === "error" ? { ...prev, assertive: message } : { ...prev, polite: message }
    );
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce.polite}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announce.assertive}
      </div>
      <div
        className="fixed z-[70] bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] flex flex-col gap-2.5 pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DURATION_MS[toast.kind]);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, toast.id, onDismiss]);

  const { box, icon, Icon } = STYLES[toast.kind];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto flex items-start gap-3 rounded-[16px] bg-white border ${box} shadow-[0_18px_40px_-18px_rgba(16,36,26,.35)] px-4 py-3`}
    >
      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${icon}`}>
        <Icon size={18} aria-hidden />
      </span>
      <p className="flex-1 min-w-0 text-[13px] leading-[20px] font-medium text-[#10241A] pt-1.5 break-words">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="w-8 h-8 -mr-1 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4F7F5] hover:text-[#10241A] shrink-0"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
