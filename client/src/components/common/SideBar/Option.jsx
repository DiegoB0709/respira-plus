function Option({
  active,
  handleSectionClick,
  OpenNotification,
  icon,
  name,
  number,
}) {
  return (
    <li className={active ? "active" : ""}>
      <a
        onClick={() => {
          if (handleSectionClick) handleSectionClick(name);
          if (OpenNotification) OpenNotification();
        }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <i className={`fa-solid fa-${icon}`}></i>
          <span>{name}</span>
        </div>
        {number !== 0 && (
          <div className="hidden md:flex justify-end items-center">
            <div
              className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center animate-pulse ${
                name === "Alertas" ? "bg-amber-300" : "bg-teal-300"
              }`}
              style={{ animationDelay: name === "Alertas" ? "0.75s" : "0s" }}
            >
              <span
                className={`flex items-center justify-center w-full h-full ${
                  name === "Alertas" ? "text-amber-800" : "text-teal-800"
                } text-xs font-bold leading-none`}
              >
                {number > 99 ? "99+" : number}
              </span>
            </div>
          </div>
        )}
      </a>
    </li>
  );
}

export default Option;
