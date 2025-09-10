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
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl ">
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-500 mb-6 text-center flex flex-col items-center justify-center gap-2">
        <i className="fas fa-user-edit text-teal-400 text-2xl" />
        <span>Actualizar Datos</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1"
            >
              <i className="fas fa-user text-gray-400" />
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Nombre requerido" })}
              className="w-full rounded-xl px-4 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1"
            >
              <i className="fas fa-phone text-gray-400" />
              Teléfono
            </label>
            <input
              id="phone"
              type="text"
              {...register("phone", { required: "Teléfono requerido" })}
              className="w-full rounded-xl px-4 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1"
          >
            <i className="fas fa-envelope text-gray-400" />
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Correo requerido" })}
            className="w-full rounded-xl px-4 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowPasswordFields((prev) => !prev)}
            className="cursor-pointer text-sm font-medium text-teal-500 hover:text-teal-400 hover:underline transition"
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
                className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1"
              >
                <i className="fas fa-lock text-gray-400" />
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
                className="w-full rounded-xl px-4 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="repeatPassword"
                className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1"
              >
                <i className="fas fa-lock text-gray-400" />
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
                className="w-full rounded-xl px-4 py-2 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm transition"
              />
              {errors.repeatPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="cursor-pointer relative w-full flex justify-center items-center gap-2 rounded-2xl bg-teal-500 px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-teal-400 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <span className="absolute inset-0 bg-white opacity-10 scale-0 hover:scale-100 transition-transform duration-300 rounded-2xl"></span>
            <i className="fas fa-save z-10" />
            <span className="z-10">Actualizar Perfil</span>
          </button>
        </div>

        {updateErrors.length > 0 && (
          <div className="text-sm text-red-500 space-y-1 mt-2">
            {updateErrors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </form>
    </div>
  );

}

export default UpdateProfile;
