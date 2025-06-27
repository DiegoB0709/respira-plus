function Option({ active, handleSectionClick, OpenNotification, icon, name }) {
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
      </a>
    </li>
  );
}

export default Option;
