import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useForm } from "react-hook-form";

function UpdateProfile({ onCloseUpdate, onOpenProfile }) {
  const {
    updateCurrentUser,
    fetchUserProfile,
    profile,
    errors: updateErrors,
  } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const password = watch("password");

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        password: "",
        repeatPassword: "",
      });
    }
  }, [profile]);

  const onSubmit = async (data) => {
    const { repeatPassword, ...updateData } = data;

    if (!showPasswordFields) {
      delete updateData.password;
    }

    const updated = await updateCurrentUser(updateData);
    if (updated) {
      alert("Perfil actualizado correctamente");
      fetchUserProfile();
      reset({ ...updateData, password: "", repeatPassword: "" });
    }

    onCloseUpdate();
    onOpenProfile();
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Actualizar Datos
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Nombre requerido" })}
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-teal-600 sm:text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-900"
            >
              Teléfono
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone", { required: "Teléfono requerido" })}
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-teal-600 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Correo requerido" })}
            className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-teal-600 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowPasswordFields((prev) => !prev)}
            className="text-sm text-teal-600 hover:underline cursor-pointer"
          >
            {showPasswordFields
              ? "Cancelar cambio de contraseña"
              : "Cambiar contraseña"}
          </button>
        </div>

        {showPasswordFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Nueva Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: showPasswordFields ? "Contraseña requerida" : false,
                  minLength: showPasswordFields
                    ? { value: 6, message: "Mínimo 6 caracteres" }
                    : undefined,
                })}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-teal-600 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="repeatPassword"
                className="block text-sm font-medium text-gray-900"
              >
                Confirmar Contraseña
              </label>
              <input
                id="repeatPassword"
                type="password"
                {...register("repeatPassword", {
                  required: showPasswordFields ? "Repite la contraseña" : false,
                  validate: showPasswordFields
                    ? (value) =>
                        value === password || "Las contraseñas no coinciden"
                    : undefined,
                })}
                className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-teal-600 sm:text-sm"
              />
              {errors.repeatPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="cursor-pointer flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-teal-600"
          >
            Actualizar Perfil
          </button>
        </div>

        {updateErrors.length > 0 && (
          <div className="text-sm text-red-600 space-y-1">
            {updateErrors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </form>
    </>
  );
}

export default UpdateProfile;
