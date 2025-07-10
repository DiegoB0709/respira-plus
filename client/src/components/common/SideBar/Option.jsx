function Option({ active, handleSectionClick, OpenNotification, icon, name, number }) {
  return (
    <li className={active ? "active" : ""}>
      <a
        onClick={() => {
          if (handleSectionClick) handleSectionClick(name);
          if (OpenNotification) OpenNotification();
        }}
      >
        <i className={`fa-solid fa-${icon}`}></i>
        <span>{name}</span>
        {number !== 0 && (
          <div className="flex justify-end items-center w-8">
            <span className="bg-teal-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {number}
            </span>
          </div>
        )}
      </a>
    </li>
  );
}

export default Option;
