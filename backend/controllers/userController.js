import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import Email from '../models/emailModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hashedPassword) {
      const user = await User.create({ username, email, password: hashedPassword });

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
    });
  });
};

export const authUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  console.log('Received login request:', { emailOrUsername, password });

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  console.log('Found user:', user);

  if (user) {
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
          token: generateToken(user._id),
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
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function(err, hashedPassword) {
          user.password = hashedPassword;
          const updatedUser = await user.save();

          res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
          });
        });
      });
    } else {
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    }
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

    if (req.body.password) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, async function(err, hashedPassword) {
          user.password = hashedPassword;
          const updatedUser = await user.save();

          res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
          });
        });
      });
    } else {
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      });
    }
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
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(temporaryPassword, salt, async function(err, hashedPassword) {
      user.temporaryPassword = hashedPassword;
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
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
  }

  user.matchPassword(oldPassword, function(err, isMatch) {
    if (err) {
      console.log('Error comparing passwords:', err);
      res.status(500).json({ message: 'Błąd serwera' });
    } else if (isMatch) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, async function(err, hashedPassword) {
          user.password = hashedPassword;
          await user.save();
          res.json({ message: 'Hasło zostało zmienione' });
        });
      });
    } else {
      res.status(400).json({ message: 'Stare hasło jest nieprawidłowe' });
    }
  });
};