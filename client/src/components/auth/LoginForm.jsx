import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Buttons/Button";
import Input from "../common/Imput/Input";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({mode: "onChange",});
  const { signin, errors: signinErrors } = useAuth();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const fields = [
    {
      name: "email",
      type: "email",
      label: "Correo Electrónico",
      icon: "fa-envelope",
      placeholder: "ejemplo@correo.com",
      rules: { required: "Correo requerido" },
    },
    {
      name: "password",
      type: "password",
      label: "Contraseña",
      icon: "fa-lock",
      placeholder: "********",
      rules: { required: "Contraseña requerida" },
    },
  ];

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="mb-6">
          <Input
            type={field.type}
            name={field.name}
            label={field.label}
            icon={field.icon}
            placeholder={field.placeholder}
            {...register(field.name, field.rules)}
          />
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-600">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <div>
        <Button
          type={"bg1"}
          label={"Inicia Sesión"}
          submit={true}
        />
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
