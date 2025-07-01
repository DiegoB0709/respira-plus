import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: signinErrors } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900"
        >
          Correo Electrónico
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", { required: "Correo requerido" })}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900"
          >
            Contraseña
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Contraseña requerida" })}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="cursor-pointer flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Inicia Sesión
        </button>
      </div>

      {signinErrors.length > 0 && (
        <div className="text-sm text-red-600 space-y-1">
          {signinErrors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
    </form>
  );
}

export default LoginForm;
