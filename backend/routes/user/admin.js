import express from 'express';
import User from '../../models/userModel.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { protect } from '../../middleware/authMiddleware.js';
import { isAdmin } from '../../utils/roleCheck.js';

dotenv.config();

const router = express.Router();

// Trasa pobierająca wysztkich rejestratorów
router.get('/view-all-registrars', protect, async (request, response) => {
    try {

      const isUserAdmin = await isAdmin(request.user._id);
        
      if (!isUserAdmin) {
          return response.status(403).json({ message: 'Brak uprawnień administratora' });
      }

        const allUsers = await User.find({
          role: { $eq: 'registrar' }
        });
        return response.status(200).json({
          data: allUsers
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Trasa do blokowania użytkowników przez administratora

router.put('/block-registrar/:_id', protect, async (request, response) => {
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
  
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        return response.status(403).json({ message: 'Nie możesz zablokować administratora ani Superadministratora. To może wykonać tylko Super Administrator.' });
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

// Trasa do odblokowania użytkowników przez administratora

router.put('/unblock-registrar/:_id', protect, async (request, response) => {
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
  
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        return response.status(403).json({ message: 'Nie możesz odblokować administratora ani Superadministratora. To może wykonać tylko Super Administrator.' });
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

export default router;
