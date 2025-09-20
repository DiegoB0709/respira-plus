function LogoSidebar() {
  return (
    <a
      className="flex items-center justify-start gap-3 mt-2
      font-bold tracking-wide
      transition-colors duration-300 px-4.5 select-none"
    >
      <span className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
        <i className="fa-solid fa-lungs text-4xl"></i>
        <span className="text-3xl font-extrabold leading-none">Respira</span>
      </span>

      <span className="text-2xl font-bold text-teal-400 leading-none ml-1 translate-y-[-0.3em]">
        +
      </span>
    </a>
  );
}

export default LogoSidebar;
