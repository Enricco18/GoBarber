import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class ScheduleControler {
  async index(req, res) {
    try {
      const isProvider = await User.findOne({
        where: { id: req.userId, provider: true },
      });

      if (!isProvider) {
        return res.status(401).json({ error: 'User is not provider' });
      }

      const { date } = req.query;
      console.log(date);
      const parsedDate = parseISO(date);

      const appointments = await Appointment.findAll({
        where: {
          provider_id: req.userId,
          canceled_at: null,
          date: {
            [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          },
        },
        order: ['date'],
        attributes: ['id', 'date'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
        ],
      });

      return res.json(appointments);
    } catch (error) {
      return res.status(501).json({ error: 'An unexpected error occurred' });
    }
  }
}

export default new ScheduleControler();