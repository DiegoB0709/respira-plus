import { useEffect, useState } from "react";

function Toast({ type = "notification", message, onClose }) {
  const [visible, setVisible] = useState(false);

  const typeStyles = {
    notification: "bg-teal-500 text-white",
    alert: "bg-amber-500 text-white",
    error: "bg-red-500 text-white",
  };

  const typeIcons = {
    notification: "fa-solid fa-circle-info",
    alert: "fa-solid fa-triangle-exclamation",
    error: "fa-solid fa-circle-xmark",
  };

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => handleClose(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0
        flex items-center gap-3 max-w-sm w-full px-4 py-3 rounded-lg shadow-md
        transform transition-all duration-300 ease-out z-1000
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        ${typeStyles[type]}`}
    >
      <i className={`${typeIcons[type]} text-lg`}></i>

      <p className="text-sm font-medium flex-1">{message}</p>

      <button
        onClick={handleClose}
        className="ml-2 text-white/80 hover:text-white transition cursor-pointer"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

export default Toast;
