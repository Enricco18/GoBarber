import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import AvailableController from './app/controllers/AvailableController';

const router = new Router();
const upload = multer(multerConfig);

router.post('/users', UserController.store);

router.post('/sessions', SessionController.store);

router.use(authMiddleware);

router.put('/users', UserController.update);

router.get('/providers', ProviderController.index);
router.get('/providers/:providerId/available', AvailableController.index);

router.post('/files', upload.single('file'), FileController.store);

router.post('/appointments', AppointmentController.store);
router.get('/appointments', AppointmentController.index);
router.delete('/appointments/:id', AppointmentController.delete);

router.get('/notifications', NotificationController.index);
router.put('/notifications/:id', NotificationController.update);

router.get('/schedule', ScheduleController.index);

export default router;
