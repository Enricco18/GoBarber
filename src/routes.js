import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/users', (req, res) => UserController.store(req, res));

router.post('/sessions', (req, res) => SessionController.store(req, res));

router.use(authMiddleware);

router.put('/users', (req, res) => UserController.update(req, res));

router.post('/files', upload.single('file'), (req, res) =>
  FileController.store(req, res)
);

router.get('/', (req, res) => {
  return res.json({ message: 'oi' });
});

export default router;
