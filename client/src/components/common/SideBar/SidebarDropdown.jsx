import { useState } from "react";

function SidebarDropdown({ icon, label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-4 rounded-xl
    text-gray-800 dark:text-neutral-50 font-medium text-base
    hover:bg-indigo-50 dark:hover:bg-neutral-800 hover:text-indigo-700
    transition-colors duration-300 ease-in-out
    group"
      >
        <span
          className="flex h-9 w-9 items-center justify-center
      rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300
      group-hover:bg-indigo-100 dark:group-hover:bg-neutral-600 group-hover:text-indigo-600
      transition-colors duration-300 ease-in-out"
        >
          <i className={`fa-solid ${icon} text-base`}></i>
        </span>

        <span className="flex-1 text-left">{label}</span>

        <i
          className={`fa-solid fa-chevron-right text-sm text-gray-400 dark:text-neutral-400
      transition-transform duration-300 ease-in-out
      ${open ? "rotate-90 text-indigo-600" : ""}`}
        ></i>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 pl-6">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg
                  text-gray-700 dark:text-neutral-300 text-sm
                  hover:bg-indigo-50 dark:hover:bg-neutral-800 hover:text-indigo-700
                  transition-colors duration-300 ease-in-out
                  group"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center
                    rounded-md bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400
                    group-hover:bg-indigo-100 dark:group-hover:bg-neutral-600 group-hover:text-indigo-600
                    transition-colors duration-300 ease-in-out"
                >
                  <i className={`fa-solid ${item.icon} text-sm`}></i>
                </span>

                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default SidebarDropdown;
