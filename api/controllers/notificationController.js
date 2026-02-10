import Notification from "../models/Notification.js";

// GET latest notification
export const getLatestNotification = async (req, res) => {
  try {
    const latest = await Notification.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: 'No notifications found' });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE notification (Admin)
export const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const notification = await Notification.create({ title, message });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE notification (Admin)
export const updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE notification (Admin)
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
