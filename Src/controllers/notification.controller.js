import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("[Error] Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("[Error] Error al marcar como leída:", error);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    res
      .status(200)
      .json({
        message: "Todas las notificaciones fueron marcadas como leídas",
      });
  } catch (error) {
    console.error("[Error] Error al marcar todas como leídas:", error);
    res.status(500).json({ message: "Error al actualizar notificaciones" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.status(200).json({ message: "Notificación eliminada" });
  } catch (error) {
    console.error("[Error] Error al eliminar notificación:", error);
    res.status(500).json({ message: "Error al eliminar notificación" });
  }
};


