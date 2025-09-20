function Button({
  type = "bg1",
  onClick,
  icon,
  label,
  disabled,
  submit = false,
  full = true,
  classes,
}) {
  const typeColors = {
  bg1: "from-teal-400 to-cyan-500 dark:from-teal-600 dark:to-cyan-700",
  bg2: "from-teal-400 to-emerald-400 dark:from-teal-600 dark:to-emerald-700",
  bg3: "from-teal-400 to-sky-500 dark:from-teal-600 dark:to-sky-700",
  bg4: "from-teal-400 to-indigo-500 dark:from-teal-600 dark:to-indigo-700",
  bg5: "from-teal-400 to-green-400 dark:from-teal-600 dark:to-green-700",
  bg6: "from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700",
  back: "from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800",
  alert: "from-rose-500 to-rose-600 dark:from-rose-700 dark:to-rose-800",
};

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`hover:brightness-110 cursor-pointer bg-gradient-to-r ${
        typeColors[type]
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } text-white rounded-2xl text-sm transition font-semibold
        w-full
        ${
          full
            ? "flex justify-center items-center sm:w-full px-6 py-3"
            : "flex justify-center items-center sm:w-auto px-4 py-2"
        }
        ${classes}`}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <i className={`fas ${icon}`}></i>}
        {label}
      </span>
    </button>
  );
}

export default Button;
