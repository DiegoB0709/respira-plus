import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { signup, errors: signupErrors } = useAuth();
  const password = watch("password");

  const onSubmit = handleSubmit((data) => {
    signup(data);
  });

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-900"
          >
            Nombre Completo
          </label>
          <div className="mt-2">
            <input
              id="username"
              type="text"
              {...register("username", { required: "Nombre requerido" })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-900"
          >
            Teléfono
          </label>
          <div className="mt-2">
            <input
              id="phone"
              type="number"
              {...register("phone", {
                valueAsNumber: true,
                required: "Teléfono requerido",
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900"
          >
            Contraseña
          </label>
          <div className="mt-2">
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Contraseña requerida",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres",
                },
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="repeatPassword"
            className="block text-sm font-medium text-gray-900"
          >
            Confirmar Contraseña
          </label>
          <div className="mt-2">
            <input
              id="repeatPassword"
              type="password"
              {...register("repeatPassword", {
                required: "Confirma tu contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
            />
            {errors.repeatPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.repeatPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="registrationToken"
          className="block text-sm font-medium text-gray-900"
        >
          Código Asignado
        </label>
        <div className="mt-2">
          <input
            id="registrationToken"
            type="text"
            {...register("registrationToken", { required: "Código requerido" })}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm"
          />
          {errors.registrationToken && (
            <p className="mt-1 text-sm text-red-600">
              {errors.registrationToken.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="duration-150 ease-in-out cursor-pointer flex w-full justify-center rounded-md bg-teal-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          Registrarse
        </button>
      </div>

      {signupErrors.length > 0 && (
        <div className="text-sm text-red-600 space-y-1">
          {signupErrors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
    </form>
  );
}

export default RegisterForm;
