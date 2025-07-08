function ModalContainer({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-101 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-teal-500  hover:scale-120 hover:text-teal-400 transition-all duration-200 ease-in-out  cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="mt-6 overflow-y-auto max-h-[80vh] pr-2 pl-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalContainer;
