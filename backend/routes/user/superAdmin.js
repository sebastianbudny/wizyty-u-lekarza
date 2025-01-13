import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from '../../models/userModel.js';
import { emailTransport } from '../../config/emailConfig.js';
import { isSuperAdmin } from '../../utils/roleCheck.js';
import { protect } from '../../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

const generateResetToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  };

// Trasa służąca do zatwierdzenia wniosku o konto administratora
router.post('/admin-request-approve/:id', protect, async (request, response) => {
    try {
        const isUserSuperAdmin = await isSuperAdmin(request.user._id);
        
        if (!isUserSuperAdmin) {
            return response.status(403).json({ message: 'Brak uprawnień Super administratora' });
        }

      const user = await User.findById(request.params.id);
  
      if (!user) {
        return response.status(404).json({ 
          message: 'Nie znaleziono użytkownika' 
        });
      }
  
      if (!user.askForAdminAcess) {
        return response.status(400).json({ 
          message: 'Ten użytkownik nie złożył wniosku o konto administratora' 
        });
      }

      if (user.askForAdminAcess === false || user.approvedBySuperAdmin === true || user.isActive === true) {
        return response.status(400).json({
          message: 'Ten użytkownik nie złożył wniosku o konto administratora lub jego wniosek został już zatwierdzony lub konto jest już aktywne'
        });
      }
  
      // Generacja tokenu resetu hasła
      const resetToken = generateResetToken(user._id);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 86400000); // 24 godziny
      user.isActive = true;
      user.approvedBySuperAdmin = true;
      await user.save();
  
      // Wysłanie maila z linkiem do resetu hasła
      const transporter = await emailTransport();
      const resetUrl = `${request.protocol}://${request.get('host')}/reset-password/${resetToken}`;
  
      const info = await transporter.sendMail({
        from: '"System Administracyjny" <noreply@example.com>',
        to: user.email,
        subject: 'Ustaw hasło dla konta administratora',
        html: `
          <h1>Konto administratora zostało zatwierdzone</h1>
          <p>Twój wniosek o konto administratora został zatwierdzony.</p>
          <p>Kliknij w poniższy link aby ustawić hasło:</p>
          <a href="${resetUrl}">Ustaw hasło</a>
          <p>Link wygaśnie za dobę.</p>
        `
      });
  
      response.status(200).json({ 
        message: 'Konto administratora zostało zatwierdzone i email został wysłany',
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
  
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Błąd serwera' });
    }
  });

// Trasa służąca do wyświetlenia wszystkich wniosków o konto administratora
router.get('/admin-requests', protect, async (request, response) => {
    try {
        const isUserSuperAdmin = await isSuperAdmin(request.user._id);

        console.log(isUserSuperAdmin);
        
        if (!isUserSuperAdmin) {
            return response.status(403).json({ message: 'Brak uprawnień Super administratora' });
        }

      const readAdminRequests = await User.find({ approvedBySuperAdmin: false, role: 'admin' });
      return response.status(200).json(readAdminRequests);
  
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Błąd serwera' });
    }
  });

// Trasa służąca do wyświetlenia wszystkich kont administratorów (aktywnych i nieaktywnych) nie licząc niezatwierdzonych wniosków
router.get('/view-all-admins', protect, async (request, response) => {
    try {
        const isUserSuperAdmin = await isSuperAdmin(request.user._id);
        
        if (!isUserSuperAdmin) {
            return response.status(403).json({ message: 'Brak uprawnień Super administratora' });
        }

      const allAdmins = await User.find({ role: 'admin', approvedBySuperAdmin: true });
      return response.status(200).json(allAdmins);
  
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Błąd serwera' });
    }
  });

  // Trasa służąca do zablokowania konta administratora
router.put('/block-admin/:_id', protect, async (request, response) => {
    try {
        const isUserSuperAdmin = await isSuperAdmin(request.user._id);
        if (!isUserSuperAdmin) {
            return response.status(403).json({ message: 'Brak uprawnień Super administratora' });
        }

      const { _id: idFromURL } = request.params;

      // Walidacja _id z URL
      if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
        return response.status(404).json({ message: 'Nie znaleziono administratora o podanym Id do zablokowania - Niepoprawne ID' });
      }

      const user = (await User.findById({_id: idFromURL}));
  
      if (!user) {
        return response.status(404).json({ 
          message: 'Nie znaleziono administratora o podanym Id do zablokowania' 
        });
      }
  
      if (user.role !== 'admin' || user.approvedBySuperAdmin === false) {
        return response.status(400).json({ 
          message: 'Ten użytkownik nie jest administratorem lub jego konto nie zostało zatwierdzone przez Super administratora.' 
        });
      }

      if (user?.isActive === false) {
        return response.status(400).json({ message: 'Administrator jest już zablokowany.' });
      }
      
      // Zablokuj administratora
      const blockAdmin = await User.findByIdAndUpdate(idFromURL, {isActive: false}, {new: true});
  
      if (!blockAdmin) {
        return response.status(500).json({ message: 'Błąd, nie udało się zablokować administratora' });
      }

      response.status(200).json({message: 'Zablokowano administratora'});
  
    } catch (error) {
      console.error(error.message);
      response.status(500).json({ message: error.message });
    }
  });

// Trasa służąca do odblokowania konta administratora
router.put('/unblock-admin/:_id', protect, async (request, response) => {
    try {
        const isUserSuperAdmin = await isSuperAdmin(request.user._id);
        if (!isUserSuperAdmin) {
            return response.status(403).json({ message: 'Brak uprawnień Super administratora' });
        }

      const { _id: idFromURL } = request.params;

      // Walidacja _id z URL
      if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
        return response.status(404).json({ message: 'Nie znaleziono użytkownika o podanym Id do odblokowania - Niepoprawne ID' });
      }

      const user = (await User.findById({_id: idFromURL}));
  
      if (!user) {
        return response.status(404).json({ 
          message: 'Nie znaleziono użytkownika o podanym Id do odblokowania' 
        });
      }
  
      if (user.role !== 'admin' || user.approvedBySuperAdmin === false) {
        return response.status(400).json({ 
          message: 'Ten użytkownik nie jest administratorem lub jego konto nie zostało zatwierdzone przez Super administratora.' 
        });
      }

      if (user?.isActive === true) {
        return response.status(400).json({ message: 'Użytkownik jest już odblokowany.' });
      }
      
      // Odblokuj administratora
      const unblockAdmin = await User.findByIdAndUpdate(idFromURL, {isActive: true}, {new: true});
  
      if (!unblockAdmin) {
        return response.status(500).json({ message: 'Błąd, nie udało się odblokować administratora' });
      }

      response.status(200).json({message: 'Odblokowano administratora'});
  
    } catch (error) {
      console.error(error.message);
      response.status(500).json({ message: error.message });
    }
  });

export default router;