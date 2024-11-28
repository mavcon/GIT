import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "info":
        return "alert-info";
      default:
        return "";
    }
  };

  return (
    <div className="toast toast-top toast-end">
      <div className={`alert ${getTypeStyles()}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
