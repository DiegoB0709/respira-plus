import Button from "../Buttons/Button";

function Modal({ type, onClose, onSubmit, title, message, token }) {
  const typeClasses = {
    alert: "bg-rose-100 text-rose-600",
    success: "bg-teal-100 text-teal-400",
    error: "bg-red-100 text-red-600",
    loading: "bg-teal-100 text-teal-500",
  };

  const typeIcon = {
    alert: "fa-circle-exclamation",
    success: "fa-check",
    error: "fa-times",
    loading: "fa-spinner fa-spin",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 ease-in-out rounded-2xl shadow-2xl p-8 text-center space-y-4 max-w-md w-full">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto ${typeClasses[type]} transition-colors duration-300 ease-in-out`}
        >
          <i className={`fa-solid ${typeIcon[type]} text-xl`} />
        </div>

        {title && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out text-center">
            {title}
          </h2>
        )}
        {message && (
          <p className="text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-sm">
            {message}
          </p>
        )}
        {token && (
          <div className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 transition-colors duration-300 ease-in-out rounded-lg p-3 text-sm text-gray-700 dark:text-neutral-300 text-center break-all">
            <span className="font-semibold text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
              Token:
            </span>{" "}
            {token}
          </div>
        )}

        {type === "alert" && (
          <div className="flex justify-center gap-3 pt-2">
            <Button
              type="back"
              label="Cancelar"
              onClick={onClose}
              full={false}
              classes={"px-9"}
            />
            <Button
              type="alert"
              label="Confirmar"
              onClick={onSubmit}
              full={false}
              classes={"px-9"}
            />
          </div>
        )}

        {type === "error" && (
          <Button type="alert" label="Cerrar" onClick={onSubmit} full={true} />
        )}

        {type === "success" && (
          <Button type="bg1" label="Aceptar" onClick={onSubmit} full={true} />
        )}
      </div>
    </div>
  );
}

export default Modal;
