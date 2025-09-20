import LogoSidebar from "./LogoSidebar";

function Sidebar({ isOpen, children }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-80 h-screen transition-transform
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0
`}
      aria-label="Sidebar"
    >
      <div className="h-full px-5 py-6 overflow-y-auto bg-gray-50 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700 transition-colors duration-300 ease-in-out">
        <LogoSidebar />

        <ul className="mt-8 space-y-2 font-medium">{children}</ul>
      </div>
    </aside>
  );
}

export default Sidebar;
