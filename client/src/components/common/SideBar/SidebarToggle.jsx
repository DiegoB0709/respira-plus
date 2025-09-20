function SidebarToggle({ isOpen, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer fixed top-5 z-50 flex h-12 w-12 items-center justify-center
        rounded-full bg-white dark:bg-neutral-900 shadow-md lg:hidden
        transition-all duration-300 ease-in-out
        hover:shadow-lg active:scale-95
        text-teal-400
        ${isOpen ? "left-[330px]" : "left-5"}`}
    >
      <span className="sr-only">
        {isOpen ? "Close sidebar" : "Open sidebar"}
      </span>

      {isOpen ? (
        <i className="fa-solid fa-xmark text-lg"></i>
      ) : (
        <i className="fa-solid fa-bars text-lg"></i>
      )}
    </button>
  );
}

export default SidebarToggle;
