function ModalContainer({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)] p-4 "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 text-teal-600 rounded-full hover:scale-110 hover:bg-gray-200 transition-all duration-200 ease-in-out shadow-sm cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer