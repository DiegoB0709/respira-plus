import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext";
import Input from "../Imput/Input";
import Button from "../Buttons/Button";
import Modal from "./Modal";
import Toast from "../Toast/Toast";

function RegisterToken() {
  const { user, createRegistrationToken, errors: tokenErrors } = useAuth();
  const { fetchDoctors, doctors } = useUser();

  const isDoctor = user?.role === "doctor";

  const [token, setToken] = useState("");
  const [role, setRole] = useState(isDoctor ? "Paciente" : "Doctor");
  const [selectedDoctor, setSelectedDoctor] = useState(isDoctor ? user.id : "");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleGenerateToken = async () => {
    const payload = role === "Paciente" ? { doctorId: selectedDoctor } : {};
    const newToken = await createRegistrationToken(payload);
    if (newToken) {
      setToken(newToken);
      setShowSuccess(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setToken("");
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 space-y-5">
        <Input
          type="select"
          name="role"
          label="Rol"
          icon="fa-user-tag"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isDoctor}
          placeholder="Selecciona un rol"
          options={[
            { value: "Doctor", label: "Doctor" },
            { value: "Paciente", label: "Paciente" },
          ]}
        />

        {role === "Paciente" && (
          <Input
            type="select"
            name="doctor"
            label="Asignar a doctor"
            icon="fa-user-md"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            disabled={isDoctor}
            placeholder="Seleccione un doctor"
            options={doctors.map((doctor) => ({
              value: doctor._id,
              label: doctor.username || doctor.email,
            }))}
          />
        )}

        {tokenErrors &&
          tokenErrors.map((e, i) => <Toast key={i} type="error" message={e} />)}

        <Button
          type="bg1"
          onClick={handleGenerateToken}
          icon="fa-magic"
          label="Generar Token"
          disabled={!!token || (role === "Paciente" && !selectedDoctor)}
          full={true}
          classes="py-3 shadow-md"
        />
      </div>

      {showSuccess && (
        <Modal
          type="success"
          title="¡Token generado correctamente!"
          token={token}
          onSubmit={handleCloseSuccess}
        />
      )}
    </>
  );
}

export default RegisterToken;
