import "../styles/Toast.css";

const Toast = ({ message, type, visible }) => {
  if (!visible) return null;

  return (
    <div className={`toast-toast ${type || "info"}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
