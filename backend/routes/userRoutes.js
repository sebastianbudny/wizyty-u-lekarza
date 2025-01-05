import express from 'express';
import User from '../models/userModel.js';
import Email from '../models/emailModel.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/register', async (req, res) => {
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
    });
  } else {
    res.status(400).json({ message: 'Nieprawidłowe dane użytkownika' });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (user && user.isActive && !user.blocked) {
    user.matchPassword(password, function(err, isMatch) {
      if (err) {
        console.log('Error comparing passwords:', err);
        res.status(500).json({ message: 'Błąd serwera' });
      } else if (isMatch) {
        console.log('Password match successful');
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        });
      } else {
        console.log('Invalid email/login or password');
        res.status(401).json({ message: 'Nieprawidłowy email/login lub hasło' });
      }
    });
  } else {
    console.log('Invalid email/login or password');
    res.status(401).json({ message: 'Nieprawidłowy email/login lub hasło' });
  }
});

router.get('/profile', async (req, res) => {
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
});

router.put('/profile', async (req, res) => {
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
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
});

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Zablokowanie użytkownika
router.put('/block/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.blocked = true;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      blocked: updatedUser.blocked,
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
});

// Odblokowanie użytkownika
router.put('/unblock/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.blocked = false;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      blocked: updatedUser.blocked,
    });
  } else {
    res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }
});

router.post('/reset-password', async (req, res) => {
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
});

router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }

  user.matchPassword(oldPassword, async function(err, isMatch) {
    if (err) {
      console.log('Error comparing passwords:', err);
      res.status(500).json({ message: 'Błąd serwera' });
    } else if (isMatch) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Hasło zostało zmienione' });
    } else {
      res.status(400).json({ message: 'Stare hasło jest nieprawidłowe' });
    }
  });
});

// Dodanie użytkownika
router.post('/add', async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'Użytkownik już istnieje' });
    return;
  }

  const user = await User.create({ username, email, password, role });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Nieprawidłowe dane użytkownika' });
  }
});

export default router;