import { Router } from 'express';

import UserController from './app/controllers/UserController';

const router = new Router();

router.post('/users', (req, res) => UserController.store(req, res));

router.get('/', (req, res) => {
  return res.json({ message: 'oi' });
});

export default router;
