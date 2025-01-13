import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from "validator";
import nodemailer from 'nodemailer';
import { User } from '../../models/userModel.js';
import { emailTransport } from '../../config/emailConfig.js';

dotenv.config();

const router = express.Router();

// Generowanie JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const generateResetToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

//Rejestracja
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
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  });
  
// Logowanie
router.post('/login', async (request, response) => {
    try {
      const { emailOrUsername, password } = request.body;
  
      const user = await User.findOne({
        $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
      });
  
      if (!user) {
        return response.status(401).json({ message: 'Nieprawidłowy login bądź mail' });
      }
  
      if (user?.isActive === false) {
        return response.status(403).json({ message: 'Konto jest zablokowane' });
      }

      if (password === null || password === undefined) {
        return response.status(400).json({ message: 'Hasło jest wymagane' });
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
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });

//Zapomniane hasło
router.post('/forgot-password', async (request, response) => {
    try {
      const { email } = request.body;
  
      if (!email || !validator.isEmail(email)) {
        return response.status(400).json({ message: 'Nieprawidłowy adres email' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(404).json({ message: 'Nie znaleziono użytkownika' });
      }
  
      const resetToken = generateResetToken(user._id);
  
      // Save token hash in database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
  
      console.log('Generated token:', resetToken); // Debug log
  
      // Send email using ethereal
      const transporter = await emailTransport();
      const resetUrl = `${request.protocol}://${request.get('host')}/reset-password/${resetToken}`;
  
      const info = await transporter.sendMail({
        from: '"System Reset Hasła" <noreply@example.com>',
        to: user.email,
        subject: 'Reset hasła',
        html: `
          <h1>Reset hasła</h1>
          <p>Kliknij w link aby zresetować hasło:</p>
          <a href="${resetUrl}">Reset hasła</a>
          <p>Link wygaśnie za godzinę.</p>
        `
      });
  
      response.status(200).json({
        message: 'Email wysłany',
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
  
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Błąd serwera' });
    }
  });
  
//Resetowanie hasła
router.post('/reset-password/:token', async (request, response) => {
    try {
      const { password } = request.body;
      const { token } = request.params;
  
      console.log('Received token:', token); // Debug log
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log
  
      const user = await User.findOne({
        _id: decoded._id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      const passwordExists = user.password;
  
      console.log('Found user:', user); // Debug log
  
      if (!user) {
        return response.status(400).json({ message: 'Nieprawidłowy lub wygasły token' });
      }
  
      if (!validator.isStrongPassword(password)) {
        return response.status(400).json({ 
          message: 'Hasło musi zawierać min. 8 znaków, dużą i małą literę, cyfrę i znak specjalny' 
        });
      }
  
      // Check if new password matches old password
      if (!passwordExists === null || !passwordExists === undefined) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return response.status(400).json({ 
            message: 'Nowe hasło nie może być takie samo jak poprzednie' 
          });
        }
      }
  
      // Hash new password and save
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      if (passwordExists) {
        return response.status(200).json({ message: 'Hasło zostało zmienione' });
      } else {
        return response.status(201).json({ message: 'Hasło zostało ustawione' });
      }
  
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ message: 'Nieprawidłowy token' });
      }
      response.status(500).json({ message: 'Błąd serwera' });
    }
});

export default router;