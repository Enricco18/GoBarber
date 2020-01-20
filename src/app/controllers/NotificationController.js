import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    try {
      const isProvider = await User.findOne({
        where: { id: req.userId, provider: true },
      });

      if (!isProvider) {
        return res
          .status(401)
          .json({ error: 'Only provider can see notifications' });
      }

      const notifications = await Notification.find({
        user: req.userId,
      })
        .sort({ createdAt: 'desc' })
        .limit(20);

      return res.json(notifications);
    } catch (error) {
      return res.status(501).json({ error: 'Aconteceu um erro inesperado' });
    }
  }

  async update(req, res) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      return res.json(notification);
    } catch (error) {
      return res.status(501).json({ error: 'Aconteceu um erro inesperado' });
    }
  }
}

export default new NotificationController();
