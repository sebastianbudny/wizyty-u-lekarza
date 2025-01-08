import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    res.status(400).json({ message: 'Użytkownik już istnieje' });
    return;
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Nieprawidłowe dane użytkownika' });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({ $or: [{ username: emailOrUsername }, { email: emailOrUsername }] });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }
});

export default router;