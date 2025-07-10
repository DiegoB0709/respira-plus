function ActionButton({
  type = "info",
  onClick = () => {},
  title = "",
  disabled = false,
}) {
  const baseClasses =
    "text-white text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1 transition-all";
  const typeClasses = {
    info: "bg-teal-500 hover:bg-teal-400",
    danger: "bg-red-500 hover:bg-red-400",
    warning: "bg-yellow-500 hover:bg-yellow-400 text-black",
    success: "bg-green-500 hover:bg-green-400",
  };
  const icons = {
    info: "fa-solid fa-circle-info",
    danger: "fa-solid fa-trash",
    warning: "fa-solid fa-triangle-exclamation",
    success: "fa-solid fa-check",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]} disabled:opacity-50 cursor-pointer`}
      title={title}
      disabled={disabled}
    >
      <i className={icons[type]}></i>
      {title}
    </button>
  );
}

export default ActionButton;
