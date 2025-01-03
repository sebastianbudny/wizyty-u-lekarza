// filepath: backend/controllers/requestController.js
import User from '../models/userModel.js';
import Email from '../models/emailModel.js';
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

      // Wysyłanie wiadomości do wirtualnej skrzynki pocztowej
      const emailMessage = new Email({
        to: user.email,
        from: process.env.ADMIN_EMAIL,
        subject: 'Akceptacja wniosku o rejestrację',
        body: `Twój wniosek o rejestrację został zaakceptowany. Tymczasowe hasło: ${temporaryPassword}. Ważne przez 10 minut.`,
      });

      await emailMessage.save();
    } else if (action === 'reject') {
      // Wysyłanie wiadomości do wirtualnej skrzynki pocztowej
      const emailMessage = new Email({
        to: user.email,
        from: process.env.ADMIN_EMAIL,
        subject: 'Odrzucenie wniosku o rejestrację',
        body: 'Twój wniosek o rejestrację został odrzucony.',
      });

      await emailMessage.save();

      await user.remove();
    }

    await user.save();
    res.json({ message: 'Wniosek został obsłużony' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};