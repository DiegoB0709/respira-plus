import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import Input from "../Imput/Input";
import Button from "../Buttons/Button";
import Modal from "./Modal";

function UpdateStatusAppo({ selectedAppointment, activeModal }) {
  const { updateAppointmentStatus } = useAppointments();
  const [appointmentId, setAppointmentId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setAppointmentId(selectedAppointment._id);
  }, [selectedAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || !newStatus) return;
    await updateAppointmentStatus(appointmentId, newStatus);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    activeModal();
  };

 return (
   <>
     <div className="p-6 max-w-md mx-auto space-y-6">
       <form onSubmit={handleSubmit} className="space-y-5">
         <Input
           type="select"
           name="newStatus"
           label="Nuevo Estado"
           icon="fa-sync-alt"
           value={newStatus}
           onChange={(e) => setNewStatus(e.target.value)}
           required
           options={
             selectedAppointment.status === "pendiente" ||
             selectedAppointment.status === "solicitada"
               ? [{ value: "confirmada", label: "Confirmada" }]
               : [
                   { value: "asistió", label: "Asistió" },
                   { value: "no asistió", label: "No asistió" },
                 ]
           }
           placeholder="Selecciona..."
         />

         <Button
           type="bg1"
           icon="fa-save"
           label="Actualizar Estado"
           submit={true}
           full={true}
         />
       </form>
     </div>

     {showSuccess && (
       <Modal
         type="success"
         title="Estado actualizado con éxito"
         message="El estado de la cita ha sido actualizado."
         onSubmit={handleClose}
       />
     )}
   </>
 );
}

export default UpdateStatusAppo;
