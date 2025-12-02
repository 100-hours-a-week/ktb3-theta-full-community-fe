import { useSyncExternalStore } from "react";

let toasts = [];
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function showToast(message, { type = "info", duration = 3000 } = {}) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const toast = { id, message, type };
  toasts = [...toasts, toast];
  emit();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

export function useToastStore() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => toasts,
    () => toasts
  );
}
