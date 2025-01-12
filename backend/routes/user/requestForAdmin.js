import express from 'express';
import User from '../../models/userModel.js';
import validator from 'validator';
import nodemailer from 'nodemailer';
import { emailTransport } from '../../config/emailConfig.js';

const router = express.Router();

// Trasa służąca do wysłania wniosku o konto administratora
router.post('/request-admin', async (request, response) => {
  try {
    const { username, email, reasonForAdmin } = request.body;

    // Validation
    if (!username || !email || !reasonForAdmin) {
      return response.status(400).json({ 
        message: 'Wymagane są nazwa użytkownika, email oraz powód wniosku o uprawnienia administratorskie' 
      });
    }

    if (!validator.isEmail(email)) {
      return response.status(400).json({ 
        message: 'Nieprawidłowy adres email' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (userExists) {
      return response.status(400).json({ 
        message: 'Użytkownik z taką nazwą lub emailem już istnieje' 
      });
    }

    // Create inactive admin account
    const user = await User.create({
      username,
      email,
      role: 'admin',
      reasonForAdmin,
      isActive: false,
      approvedBySuperAdmin: false,
      askForAdminAcess: true
    });

    // Send confirmation email
    const transporter = await emailTransport();
    const info = await transporter.sendMail({
      from: '"System Administracyjny" <noreply@example.com>',
      to: email,
      subject: 'Wniosek o konto administratora',
      html: `
        <h1>Wniosek o konto administratora</h1>
        <p>Twój wniosek o utworzenie konta administratora został przyjęty.</p>
        <p>Po zaakceptowaniu przez Super Administratora, otrzymasz email z linkiem do ustawienia hasła.</p>
      `
    });

    response.status(201).json({
      message: 'Wniosek o konto administratora został wysłany',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Błąd serwera' });
  }
});

export default router;

