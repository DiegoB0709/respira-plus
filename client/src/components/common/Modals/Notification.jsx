function Notification({ onClose }) {
  return (
    <div>
      <h1>Notificaciones</h1>
      <button onClick={() => onClose()}>Cerrar</button>
    </div>
  );
}

export default Notification;
