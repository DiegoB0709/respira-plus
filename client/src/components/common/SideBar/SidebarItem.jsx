function SidebarItem({
  icon,
  label,
  badge,
  active,
  handleSectionClick,
  OpenNotification,
}) {
  return (
    <li>
      <a
        draggable="false"
        className={`select-none cursor-pointer flex items-center gap-4 p-4 rounded-xl
        font-medium text-base
        transition-colors duration-300 ease-in-out
        group hover:bg-teal-50 dark:hover:bg-neutral-800
        ${
          active
            ? "bg-teal-50 dark:bg-neutral-800"
            : "text-neutral-600 dark:text-neutral-300"
        }`}
        onClick={() => {
          if (handleSectionClick) handleSectionClick(label);
          if (OpenNotification) OpenNotification();
        }}
      >
        <span
          className={`flex-none flex h-9 w-9 items-center justify-center
          rounded-xl bg-gray-200 dark:bg-neutral-700
          transition-colors duration-300 ease-in-out
          group-hover:bg-teal-100 dark:group-hover:bg-neutral-600
          ${active ? "bg-teal-100 dark:bg-neutral-600" : ""}`}
        >
          <i
            className={`fa-solid ${icon} text-xl transition-colors duration-300 ease-in-out ${
              active
                ? "text-transparent bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text"
                : "text-gray-600 dark:text-neutral-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-sky-500 group-hover:bg-clip-text"
            }`}
          ></i>
        </span>

        <span
          className={`flex-1 transition-colors duration-300 ease-in-out
          group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-teal-400 group-hover:to-sky-500 bg-clip-text font-semibold
          ${
            active
              ? "text-transparent bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text"
              : ""
          }`}
        >
          {label}
        </span>

        {badge > 0 && (
          <span
            className={`flex-none inline-flex items-center animate-pulse justify-center px-2.5 py-0.5
            text-sm font-semibold rounded-full
            ${
              label === "Alertas"
                ? "bg-amber-300 text-amber-800 dark:bg-amber-400 dark:text-amber-900"
                : "bg-teal-300 text-teal-800 dark:bg-teal-400 dark:text-teal-900"
            }`}
            style={{ animationDelay: label === "Alertas" ? "0.75s" : "0s" }}
          >
            {badge}
          </span>
        )}
      </a>
    </li>
  );
}
export default SidebarItem;
