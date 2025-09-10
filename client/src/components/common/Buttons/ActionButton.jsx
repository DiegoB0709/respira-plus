function ActionButton({
  type = "info",
  onClick,
  title = "",
  disabled = false,
}) {
  const baseClasses =
    "text-white text-sm px-3 py-1 rounded-xl flex items-center justify-center gap-1 transition-all";
  const typeClasses = {
    info: "bg-teal-500 hover:bg-teal-400",
    danger: "bg-red-500 hover:bg-red-400",
    warning: "bg-yellow-500 hover:bg-yellow-400 text-black",
    success: "bg-green-500 hover:bg-green-400",
    view: " bg-teal-400 hover:bg-teal-300 text-white",
    viewed: "bg-slate-300 hover:bg-slate-200 text-gray-700",
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
        className={`${baseClasses} ${typeClasses[type]} disabled:opacity-50 cursor-pointer`}
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
