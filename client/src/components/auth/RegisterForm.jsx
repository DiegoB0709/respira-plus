import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Buttons/Button";
import Input from "../common/Imput/Input";
import Toast from "../common/Toast/Toast";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const { signup, errors: signupErrors } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signup(data);
  });

  const fields = [
    {
      name: "username",
      type: "text",
      label: "Nombre Completo",
      icon: "fa-user",
      placeholder: "Ej. Diego López",
      rules: { required: "Nombre requerido" },
      colSpan: 1,
    },
    {
      name: "phone",
      type: "number",
      label: "Teléfono",
      icon: "fa-phone",
      placeholder: "Ej. 987654321",
      rules: { valueAsNumber: true, required: "Teléfono requerido" },
      colSpan: 1,
    },
    {
      name: "email",
      type: "email",
      label: "Correo Electrónico",
      icon: "fa-envelope",
      placeholder: "ejemplo@correo.com",
      rules: { required: "Correo requerido" },
      colSpan: 2,
    },
    {
      name: "password",
      type: "password",
      label: "Contraseña",
      icon: "fa-lock",
      placeholder: "********",
      rules: {
        required: "Contraseña requerida",
        minLength: { value: 6, message: "Mínimo 6 caracteres" },
      },
      colSpan: 1,
    },
    {
      name: "repeatPassword",
      type: "password",
      label: "Conf. Contraseña",
      icon: "fa-key",
      placeholder: "********",
      rules: {
        required: "Confirma tu contraseña",
        validate: (value) =>
          value === getValues("password") || "Las contraseñas no coinciden",
      },
      colSpan: 1,
    },
    {
      name: "registrationToken",
      type: "text",
      label: "Código Asignado",
      icon: "fa-hashtag",
      placeholder: "Ej. ABC123",
      rules: { required: "Código requerido" },
      colSpan: 2,
    },
  ];

  return (
    <>
      {signupErrors.length > 0 &&
        signupErrors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`mb-1 col-span-1 ${
                field.colSpan === 2 ? "md:col-span-2" : ""
              }`}
            >
              <Input
                type={field.type}
                name={field.name}
                label={field.label}
                icon={field.icon}
                placeholder={field.placeholder}
                {...register(field.name, field.rules)}
              />
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <Button type={"bg1"} label={"Registrarse"} submit={true} />
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
