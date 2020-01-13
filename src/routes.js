import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const router = new Router();

router.post('/users', (req, res) => UserController.store(req, res));

router.post('/sessions', (req, res) => SessionController.store(req, res));
router.get('/', (req, res) => {
  return res.json({ message: 'oi' });
});

export default router;
