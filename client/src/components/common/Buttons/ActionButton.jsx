function ActionButton({
  type = "info",
  onClick,
  title = "",
  disabled = false,
}) {
  const baseClasses =
    "text-white text-sm px-3 py-1 rounded-xl flex items-center justify-center gap-1 transition-all";
  const typeClasses = {
    info: "bg-gradient-to-r from-teal-400 to-cyan-500",
    danger: "bg-red-500 ",
    warning: "bg-yellow-500  text-black",
    success: "bg-green-500 ",
    view: " bg-gradient-to-r from-teal-400 to-cyan-500 text-white",
    viewed: "bg-gradient-to-r from-gray-300 to-gray-400 text-white",
  };
  const icons = {
    info: "fa-solid fa-circle-info",
    danger: "fa-solid fa-trash",
    warning: "fa-solid fa-triangle-exclamation",
    success: "fa-solid fa-check",
    view: "fa-solid fa-eye",
    viewed: "fa-solid fa-eye",
  };

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        className={`${baseClasses} ${typeClasses[type]} hover:brightness-110 disabled:opacity-50 cursor-pointer`}
        title={title}
        disabled={disabled}
      >
        <i className={icons[type]}></i>
        {title}
      </button>
    </div>
  );
}

export default ActionButton;
