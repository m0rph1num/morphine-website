// src/components/Toast.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let toastCounter = 0;
const listeners = new Set();

const showToast = (title, subtitle = "") => {
  const id = toastCounter++;
  const toast = { id, title, subtitle, duration: 2000 };
  listeners.forEach((fn) => fn(toast));
  setTimeout(() => {
    listeners.forEach((fn) => fn({ ...toast, remove: true }));
  }, 2000);
};

export { showToast };

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (newToast) => {
      if (newToast.remove) {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      } else {
        setToasts((prev) => [...prev, newToast]);
      }
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <div className="toast-title">{toast.title}</div>
          {toast.subtitle && <div className="toast-subtitle">{toast.subtitle}</div>}
        </div>
      ))}
    </div>,
    document.body,
  );
}
