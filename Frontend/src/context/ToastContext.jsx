import { createContext, useCallback, useContext, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const showToast = useCallback((message, type = "info") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
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
