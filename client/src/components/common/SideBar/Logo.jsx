function Logo({ toggleSidebar }) {
  return (
    <li className="logo-cont">
      <span className="logo">
        <i className="fa-solid fa-lungs"></i> Respira +
      </span>
      <button onClick={() => toggleSidebar()} id="toggle-btn">
        <i className="fa-solid fa-angles-left"></i>
      </button>
    </li>
  );
}

export default Logo;
