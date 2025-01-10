import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from "validator";
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../utils/roleCheck.js';
import { emailTransport } from '../config/emailConfig.js';

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

    if (user?.isActive === false) {
      return response.status(403).json({ message: 'Konto zablokowane' });
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
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

// Route for block user by admin

router.put('/block/:_id', protect, async (request, response) => {
  try {
    const isUserAdmin = await isAdmin(request.user._id);
    if (!isUserAdmin) {
      return response.status(403).json({ message: 'Brak uprawnień administratora' });
    }

    const { _id: idFromURL} = request.params;

    // Validate _id from URL
    if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
      return response.status(404).json({ message: 'Nie znaleziono użytkownika o podanym Id do zablokowania - Niepoprawne ID' });
      }
    
    const user = (await User.findById({_id: idFromURL}))
    if (!user) {
      return response.status(404).send({
        message: 'Nie znaleziono użytkownika o podanym Id do zablokowania' 
      });
    }

    if (idFromURL === request.user._id) {
      return response.status(403).json({ message: 'Nie możesz zablokować samego siebie' });
    }

    if (user?.isActive === false) {
      return response.status(400).json({ message: 'Użytkownik jest już zablokowany' });
    }

    //Block the user

    const blockUser = await User.findByIdAndUpdate(idFromURL, {isActive: false}, {new: true});

    if (!blockUser) {
      return response.status(500).json({ message: 'Błąd, nie udało się zablokować użytkownika' });
    }

    return response.status(200).send({message: 'Zablokowano użytkownika'});

  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

// Route for unblock user by admin

router.put('/unblock/:_id', protect, async (request, response) => {
  try {
    const isUserAdmin = await isAdmin(request.user._id);
    if (!isUserAdmin) {
      return response.status(403).json({ message: 'Brak uprawnień administratora' });
    }

    const { _id: idFromURL} = request.params;

    // Validate _id from URL
    if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
      return response.status(404).json({ message: 'Nie znaleziono użytkownika o podanym Id do odblokowania - Niepoprawne ID' });
      }
    
    const user = (await User.findById({_id: idFromURL}))
    if (!user) {
      return response.status(404).send({
        message: 'Nie znaleziono użytkownika o podanym Id do odblokowania' 
      });
    }

    if (user?.isActive === true) {
      return response.status(400).json({ message: 'Podany użytkownik nie jest zablokowany' });
    }

    //Unblock the user

    const unblockUser = await User.findByIdAndUpdate(idFromURL, {isActive: true}, {new: true});

    if (!unblockUser) {
      return response.status(500).json({ message: 'Błąd, nie udało się odblokować użytkownika' });
    }

    return response.status(200).send({message: 'Odblokowano użytkownika'});

  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});

//Forgot password
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
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

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

//Reset password
router.post('/reset-password/:token', async (request, response) => {
  try {
    const { password } = request.body;
    const { token } = request.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return response.status(400).json({ message: 'Nieprawidłowy lub wygasły token' });
    }

    if (!validator.isStrongPassword(password)) {
      return response.status(400).json({ 
        message: 'Hasło musi zawierać min. 8 znaków, dużą i małą literę, cyfrę i znak specjalny' 
      });
    }

    // Check if new password matches old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return response.status(400).json({ 
        message: 'Nowe hasło nie może być takie samo jak poprzednie' 
      });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    response.status(200).json({ message: 'Hasło zostało zmienione' });

  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Nieprawidłowy token' });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

export default router;