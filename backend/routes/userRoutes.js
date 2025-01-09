import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from "validator";
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../utils/roleCheck.js';

dotenv.config();

const router = express.Router();

// Generowanie JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

router.post('/register', async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return response.status(400).json({ message: 'Użytkownik już istnieje' });
    }

    if (!validator.isEmail(email)) {
      return response.status(400).json({ message: 'Nieprawidłowy adres email' });
    }

    if (!validator.isStrongPassword(password)) {
      return response.status(400).json({ message: 'Hasło musi zawierać co najmniej 8 znaków, w tym jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny' });
    }

    // Hashowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      response.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.post('/login', async (request, response) => {
  try {
    const { emailOrUsername, password } = request.body;

    const user = await User.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    });

    if (!user) {
      return response.status(401).json({ message: 'Nieprawidłowy login bądź mail' });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      response.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      response.status(401).json({ message: 'Nieprawidłowe hasło' });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

// Route for Get All Users only for admin
router.get('/', protect, async (request, response) => {
    try {

      const isUserAdmin = await isAdmin(request.user._id);
        
      if (!isUserAdmin) {
          return response.status(403).json({ message: 'Brak uprawnień administratora' });
      }

        const allUsers = await User.find({});
        return response.status(200).json({
          count: allUsers.length,
          data: allUsers
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Add new Admin User

router.post('/addAdmin', protect, async (request, response) => {
  try {
    const isUserAdmin = await isAdmin(request.user._id);
    if (!isUserAdmin) {
      return response.status(403).json({ message: 'Brak uprawnień administratora' });
    }

    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return response.status(400).json({ message: 'Użytkownik już istnieje' });
    }

    if (!validator.isEmail(email)) {
      return response.status(400).json({ message: 'Nieprawidłowy adres email' });
    }

    if (!validator.isStrongPassword(password)) {
      return response.status(400).json({ message: 'Hasło musi zawierać co najmniej 8 znaków, w tym jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny' });
    }

    // Hashowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    if (user) {
      response.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

export default router;