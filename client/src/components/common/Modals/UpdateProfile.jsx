import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useForm } from "react-hook-form";
import Button from "../Buttons/Button";
import Input from "../Imput/Input";
import Modal from "./Modal";
import Toast from "../Toast/Toast";

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
  const [modal, setModal] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

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
      fetchUserProfile();
      reset({ ...updateData, password: "", repeatPassword: "" });

      setModal({
        show: true,
        type: "success",
        title: "Perfil actualizado",
        message: "Tus datos se han actualizado correctamente.",
      });
    } else {
      setModal({
        show: true,
        type: "error",
        title: "Error",
        message: "No se pudo actualizar tu perfil. Intenta nuevamente.",
      });
    }
  };

  return (
    <>
      {updateErrors.length > 0 &&
        updateErrors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="sm:p-6 sm:px-12 max-w-3xl mx-auto rounded-2xl transition-colors duration-300 ease-in-out">
        <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <i className="fas fa-user-edit bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-3xl" />
          <span>Actualizar Datos</span>
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-neutral-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-colors duration-300 ease-in-out border border-gray-100 dark:border-neutral-700 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="username"
              label="Nombre de Usuario"
              icon="fa-user"
              placeholder="Tu usuario"
              {...register("username", { required: "Nombre requerido" })}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}

            <Input
              type="text"
              name="phone"
              label="Teléfono"
              icon="fa-phone"
              placeholder="Tu teléfono"
              {...register("phone", { required: "Teléfono requerido" })}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              label="Correo Electrónico"
              icon="fa-envelope"
              placeholder="ejemplo@correo.com"
              {...register("email", { required: "Correo requerido" })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowPasswordFields((prev) => !prev)}
              className="cursor-pointer text-base font-medium bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent hover:scale-102 transition ease-in duration-200"
            >
              {showPasswordFields
                ? "Cancelar cambio de contraseña"
                : "Cambiar contraseña"}
            </button>
          </div>

          {showPasswordFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="password"
                name="password"
                label="Nueva Contraseña"
                icon="fa-lock"
                placeholder="••••••"
                {...register("password", {
                  required: showPasswordFields ? "Contraseña requerida" : false,
                  minLength: showPasswordFields
                    ? { value: 6, message: "Mínimo 6 caracteres" }
                    : undefined,
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              <Input
                type="password"
                name="repeatPassword"
                label="Conf. Contraseña"
                icon="fa-lock"
                placeholder="Repite la contraseña"
                {...register("repeatPassword", {
                  required: showPasswordFields ? "Repite la contraseña" : false,
                  validate: showPasswordFields
                    ? (value) =>
                        value === password || "Las contraseñas no coinciden"
                    : undefined,
                })}
              />
              {errors.repeatPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.repeatPassword.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Button
              type="bg3"
              icon="fa-save"
              label="Actualizar Perfil"
              submit={true}
            />
          </div>
        </form>
      </div>

      {modal.show && (
        <Modal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
          onSubmit={() => {
            setModal({ ...modal, show: false });
            if (modal.type === "success") {
              onCloseUpdate();
              onOpenProfile();
            }
          }}
        />
      )}
    </>
  );
}

export default UpdateProfile;
