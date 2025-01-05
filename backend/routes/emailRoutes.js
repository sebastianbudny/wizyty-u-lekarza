import express from 'express';
import Email from '../models/emailModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { to, from, subject, body } = req.body;

  try {
    const email = new Email({ to, from, subject, body });
    await email.save();
    res.status(201).json({ message: 'Email wysłany' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

export default router;