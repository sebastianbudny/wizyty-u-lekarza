// filepath: backend/controllers/emailController.js
import Email from '../models/emailModel.js';

export const getEmails = async (req, res) => {
  try {
    const emails = await Email.find({});
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const createEmail = async (req, res) => {
  const { to, from, subject, body } = req.body;

  try {
    const email = new Email({ to, from, subject, body });
    const savedEmail = await email.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    res.status(400).json({ message: 'Nieprawidłowe dane e-maila' });
  }
};