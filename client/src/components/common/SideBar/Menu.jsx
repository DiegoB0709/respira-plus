function Menu({
  toggleSubMenu,
  handleSectionClick,
  active,
  icon,
  name,
  options,
}) {
  return (
    <li>
      <button onClick={(e) => toggleSubMenu(e)} className="dropdown-btn">
        <i className={`fa-solid fa-${icon}`}></i>
        <span>{name}</span>
        <i className="fa-solid fa-chevron-down"></i>
      </button>
      <ul className="sub-menu">
        <div>
          {options.map((option, index) => (
            <li
              onClick={() => handleSectionClick(option)}
              className={active === option ? "active" : ""}
              key={index}
            >
              <a href="#">{option}</a>
            </li>
          ))}
        </div>
      </ul>
    </li>
  );
}

export default Menu