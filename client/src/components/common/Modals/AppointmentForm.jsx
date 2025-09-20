import { useState, useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useDoctor } from "../../../context/DoctorContext";
import { useAuth } from "../../../context/AuthContext";
import Input from "../Imput/Input";
import Button from "../Buttons/Button";
import Modal from "./Modal";

function AppointmentForm({
  setActiveModal,
  selectedAppointment,
  onAppointmentCreated,
  patientId,
}) {
  const { user } = useAuth();
  const { createAppointment, rescheduleAppointment, errors } =
    useAppointments();

  const isDoctor = user?.role === "doctor";
  const { fetchMyPatients, patients } = isDoctor
    ? useDoctor()
    : { fetchMyPatients: null, patients: [] };

  const isEditing = !!selectedAppointment;

  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (isDoctor && fetchMyPatients) fetchMyPatients();

    if (isEditing) {
      setFormData({
        patientId: selectedAppointment.patient._id,
        date: selectedAppointment.date.slice(0, 10),
        time: new Date(selectedAppointment.date).toTimeString().slice(0, 5),
        reason: selectedAppointment.reason,
      });
    } else if (patientId) {
      setFormData((prev) => ({ ...prev, patientId }));
    } else if (!isDoctor) {
      setFormData((prev) => ({ ...prev, patientId: user._id }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (isEditing) {
      result = await rescheduleAppointment(selectedAppointment._id, {
        date: formData.date,
        time: formData.time,
      });
    } else {
      const payload = {
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
      };
      result = await createAppointment(payload);
    }

    if (result) {
      setShowSuccess(true);

      if (onAppointmentCreated) onAppointmentCreated();

      if (!isEditing) {
        setFormData({
          patientId: isDoctor ? "" : user._id,
          date: "",
          time: "",
          reason: "",
        });
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setActiveModal();
  };

 return (
   <>
     <div className="relative sm:p-8 p-6 max-w-lg mx-auto space-y-6">
       {errors.length > 0 && (
         <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-xl text-sm space-y-1">
           {errors.map((err, i) => (
             <p key={i} className="flex items-center gap-2">
               <i className="fas fa-exclamation-circle text-red-500"></i>
               {err}
             </p>
           ))}
         </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-5">
         {isDoctor && (
           <Input
             type="select"
             name="patientId"
             value={formData.patientId}
             onChange={handleChange}
             disabled={!isDoctor || isEditing || !!patientId}
             label="Paciente"
             icon="fa-user"
             options={
               isDoctor
                 ? patients.map((p) => ({
                     value: p._id,
                     label: p.username,
                   }))
                 : [{ value: user._id, label: user.username }]
             }
           />
         )}

         <Input
           type="date"
           name="date"
           value={formData.date}
           onChange={handleChange}
           min={minDate}
           required
           label="Fecha"
           icon="fa-calendar-day"
         />

         <Input
           type="time"
           name="time"
           value={formData.time}
           onChange={handleChange}
           required
           label="Hora"
           icon="fa-clock"
         />

         <Input
           type="text"
           name="reason"
           value={formData.reason}
           onChange={handleChange}
           required
           disabled={isEditing}
           placeholder="Escribe el motivo de la cita"
           label="Motivo"
           icon="fa-pencil-alt"
         />

         <div className="pt-3">
           <Button
             type="bg1"
             icon={isEditing ? "fa-sync-alt" : "fa-plus"}
             label={isEditing ? "Actualizar Cita" : "Crear Cita"}
             submit={true}
           />
         </div>
       </form>
     </div>

     {showSuccess && (
       <Modal
         type="success"
         title={
           isEditing
             ? "¡Cita actualizada correctamente!"
             : "¡Cita agendada correctamente!"
         }
         message="La acción se completó exitosamente."
         onSubmit={handleCloseSuccess}
       />
     )}
   </>
 );

}

export default AppointmentForm;
