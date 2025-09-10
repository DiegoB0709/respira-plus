function ModalContainer({ onClose, children, educational = false }) {
  return (
    <div
      className="fixed inset-0 z-101 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${
          educational ? "max-w-7xl" : "max-w-xl"
        } p-6 relative max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow hover:shadow-md text-teal-500 hover:text-teal-400 transition-all duration-200 ease-in-out"
          aria-label="Cerrar modal"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <div className="mt-4 overflow-y-auto max-h-[80vh] pr-2 pl-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalContainer;
