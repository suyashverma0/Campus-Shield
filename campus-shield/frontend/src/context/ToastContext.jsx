import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = {
      id,
      type: toast.type || "info", // "success" | "error" | "info" | "match"
      title: toast.title,
      message: toast.message,
      duration: toast.duration || 4500
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title, message) => addToast({ type: "success", title, message }), [addToast]);
  const error = useCallback((title, message) => addToast({ type: "error", title, message }), [addToast]);
  const info = useCallback((title, message) => addToast({ type: "info", title, message }), [addToast]);
  const matchAlert = useCallback((title, message) => addToast({ type: "match", title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, matchAlert }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
