import * as Yup from 'yup';
import { startOfHour, isBefore, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        provider_id: Yup.number()
          .integer()
          .required(),
        date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' });
      }

      const { provider_id, date } = req.body;
      const user_id = req.userId;

      const isProvider = await User.findOne({
        where: { id: provider_id, provider: true },
      });

      if (!isProvider) {
        return res.status(401).json({ error: 'User is not a provider' });
      }

      const hourStart = startOfHour(parseISO(date));

      if (isBefore(hourStart, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      const isOccupied = await Appointment.findOne({
        where: { provider_id, date: hourStart, canceled_at: null },
      });

      if (isOccupied) {
        return res
          .status(401)
          .json({ error: 'Provider has another appointment this hour' });
      }

      const appointment = await Appointment.create({
        provider_id,
        date: hourStart,
        user_id,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(501).json({ error: 'An unexpected error occurred' });
    }
  }

  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const appointments = await Appointment.findAll({
        where: { user_id: req.userId, canceled_at: null },
        limit: 20,
        offset: (page - 1) * 20,
        order: ['date'],
        attributes: ['id', 'date'],
        include: [
          {
            model: User,
            as: 'provider',
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
export default new AppointmentController();
