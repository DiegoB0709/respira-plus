import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type,
      name,
      options = [],
      placeholder,
      value,
      onChange,
      label,
      icon,
      disabled,
      ...rest
    },
    ref
  ) => {
    if (type === "file") {
      return (
        <div className="flex flex-col">
          {label && (
            <label className="block text-gray-700 dark:text-neutral-50 font-medium mb-1 flex items-center gap-2 transition-colors duration-300 ease-in-out">
              <i
                className={`fas ${
                  icon || "fa-file-upload"
                } bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent`}
              />
              {label}
            </label>
          )}
          <label
            htmlFor={name}
            className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-teal-400 rounded-xl cursor-pointer transition-colors duration-300 ease-in-out disabled:cursor-not-allowed"
          >
            <i className="fa fa-cloud-upload-alt text-2xl mr-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
            <span className="text-gray-600 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
              Haz clic para seleccionar un archivo
            </span>
            <input
              id={name}
              name={name}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={onChange}
              disabled={disabled}
              ref={ref}
              {...rest}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 dark:text-neutral-50 mb-1 flex items-center gap-2 transition-colors duration-300 ease-in-out"
          >
            <i
              className={`fas ${icon} bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent`}
            ></i>
            {label}
          </label>
        )}

        {type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            ref={ref}
            className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-300 ease-in-out outline-none cursor-pointer disabled:bg-gray-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
            {...rest}
          />
        ) : type === "select" ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            ref={ref}
            className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-300 ease-in-out outline-none cursor-pointer disabled:bg-gray-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
            {...rest}
          >
            <option value="">{placeholder || "Seleccione una opción"}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            className={`w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2.5 text-sm text-gray-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors duration-300 ease-in-out outline-none cursor-pointer disabled:bg-gray-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed ${
              type === "number"
                ? "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : ""
            }`}
            {...rest}
          />
        )}
      </div>
    );
  }
);

export default Input;
