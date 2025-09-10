import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";

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
       <h2 className="text-xl font-bold text-teal-500 text-center flex items-center justify-center gap-2">
         <i className="fas fa-edit text-teal-400 text-lg"></i>
         Actualizar Estado de la Cita
       </h2>

       <form onSubmit={handleSubmit} className="space-y-5">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
             <i className="fas fa-sync-alt text-teal-400"></i>
             Nuevo Estado
           </label>
           <select
             value={newStatus}
             onChange={(e) => setNewStatus(e.target.value)}
             required
             className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition"
           >
             <option value="">Selecciona...</option>

             {selectedAppointment.status === "pendiente" ||
             selectedAppointment.status === "solicitada" ? (
               <option value="confirmada">Confirmada</option>
             ) : (
               <>
                 <option value="asistió">Asistió</option>
                 <option value="no asistió">No asistió</option>
               </>
             )}
           </select>
         </div>

         <button
           type="submit"
           className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-2xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
         >
           <i className="fas fa-save"></i>
           Actualizar Estado
         </button>
       </form>
     </div>

     {showSuccess && (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
           <div className="p-6 flex flex-col items-center space-y-4">
             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
               <i className="fas fa-check text-lg" />
             </div>
             <h3 className="text-lg font-semibold text-gray-800">
               Estado actualizado con éxito
             </h3>
             <p className="text-sm text-gray-500 text-center">
               El estado de la cita ha sido modificado correctamente.
             </p>
             <button
               onClick={handleClose}
               className="cursor-pointer w-full bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-xl text-sm font-medium transition-colors"
             >
               Aceptar
             </button>
           </div>
         </div>
       </div>
     )}
   </>
 );
}

export default UpdateStatusAppo;
