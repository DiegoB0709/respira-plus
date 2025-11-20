import { useEffect } from "react";

function ModalContainer({
  onClose,
  children,
  educational = false,
  icon,
  title,
  unread = 0,
  unresolved = 0,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-101 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white dark:bg-neutral-900 transition-colors duration-300 ease-in-out rounded-2xl shadow-xl w-full ${
          educational ? "max-w-7xl" : "max-w-xl"
        } p-6 relative max-h-[90vh] overflow-hidden `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white dark:bg-neutral-800 transition-colors duration-300 ease-in-out rounded-full shadow hover:shadow-md group"
          aria-label="Cerrar modal"
        >
          <i className="fa-solid fa-xmark text-2xl bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 ease-in-out group-hover:from-cyan-500 group-hover:to-teal-400"></i>
        </button>

        <div className="mt-8 mb-2 overflow-y-auto max-h-[80vh] pr-2 pl-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <h2
            className={`text-3xl font-bold bg-gradient-to-r ${
              unresolved > 0
                ? "from-yellow-300 to-amber-400"
                : "from-teal-400 to-cyan-500"
            } bg-clip-text text-transparent text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3`}
          >
            <i
              className={`fas ${icon} ${
                unresolved > 0
                  ? "from-yellow-300 to-amber-400"
                  : "from-teal-400 to-cyan-500"
              } text-2xl sm:text-2xl bg-gradient-to-r bg-clip-text text-transparent`}
            ></i>
            {title}
            {unread > 0 && (
              <div className="w-8 h-8 rounded-full shadow-md flex items-center justify-center animate-pulse from-teal-300 to-cyan-500 bg-gradient-to-r">
                <span className="flex items-center justify-center w-full h-full text-white dark:text-neutral-50 transition-colors duration-300 ease-in-out text-sm font-bold leading-none">
                  {unread > 99 ? "99+" : unread}
                </span>
              </div>
            )}
            {unresolved > 0 && (
              <div className="w-8 h-8 rounded-full shadow-md flex items-center justify-center animate-pulse bg-gradient-to-r from-yellow-300 to-amber-500">
                <span className="flex items-center justify-center w-full h-full text-white dark:text-neutral-50 transition-colors duration-300 ease-in-out text-sm font-bold leading-none">
                  {unresolved > 99 ? "99+" : unresolved}
                </span>
              </div>
            )}
          </h2>

          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalContainer;
