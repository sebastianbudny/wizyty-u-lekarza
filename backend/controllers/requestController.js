// filepath: backend/controllers/requestController.js
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const getRequests = async (req, res) => {
  try {
    const requests = await User.find({ isActive: false });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const handleRequest = async (req, res) => {
  const { userId, action } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    if (action === 'accept') {
      const temporaryPassword = crypto.randomBytes(8).toString('hex');
      user.temporaryPassword = temporaryPassword;
      user.temporaryPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minut
      user.isActive = true;

      // Wysyłanie e-maila do użytkownika
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Akceptacja wniosku o rejestrację',
        text: `Twój wniosek o rejestrację został zaakceptowany. Tymczasowe hasło: ${temporaryPassword}. Ważne przez 10 minut.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } else if (action === 'reject') {
      // Wysyłanie e-maila do użytkownika
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Odrzucenie wniosku o rejestrację',
        text: 'Twój wniosek o rejestrację został odrzucony.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      await user.remove();
    }

    await user.save();
    res.json({ message: 'Wniosek został obsłużony' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};