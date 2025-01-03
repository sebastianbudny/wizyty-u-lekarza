// filepath: backend/controllers/userController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import Email from '../models/emailModel.js';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'Użytkownik już istnieje' });
    return;
  }

  const user = await User.create({ username, email, password });

  if (user) {
    // Wysyłanie wiadomości do wirtualnej skrzynki pocztowej
    const emailMessage = new Email({
      to: process.env.ADMIN_EMAIL,
      from: email,
      subject: 'Nowa rejestracja użytkownika',
      body: `Nowy użytkownik zarejestrował się w systemie. Username: ${username}, Email: ${email}`,
    });

    await emailMessage.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Nieprawidłowe dane użytkownika' });
  }
};

export const authUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Nieprawidłowy email/login lub hasło' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'Użytkownik usunięty' });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }

  const temporaryPassword = crypto.randomBytes(8).toString('hex');
  user.temporaryPassword = temporaryPassword;
  user.temporaryPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minut

  // Wysyłanie wiadomości do wirtualnej skrzynki pocztowej
  const emailMessage = new Email({
    to: email,
    from: process.env.ADMIN_EMAIL,
    subject: 'Resetowanie hasła',
    body: `Twoje tymczasowe hasło: ${temporaryPassword}. Ważne przez 10 minut.`,
  });

  await emailMessage.save();

  await user.save();
  res.json({ message: 'Tymczasowe hasło zostało wysłane na e-mail' });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }

  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return res.status(400).json({ message: 'Stare hasło jest nieprawidłowe' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Hasło zostało zmienione' });
};