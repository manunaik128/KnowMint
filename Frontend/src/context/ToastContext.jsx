import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });
  const [timeoutId, setTimeoutId] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setToast({ message, type, visible: true });

    const id = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
      setTimeoutId(null);
    }, 3000);

    setTimeoutId(id);
  }, [timeoutId]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  
  return {
    success: (message) => context.showToast(message, "success"),
    error: (message) => context.showToast(message, "error"),
    info: (message) => context.showToast(message, "info"),
    warning: (message) => context.showToast(message, "warning"),
  };
};
