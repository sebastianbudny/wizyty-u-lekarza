import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../../models/userModel.js';
import { protect } from '../../middleware/authMiddleware.js';
import { isAdmin } from '../../utils/roleCheck.js';

dotenv.config();

const router = express.Router();

//Trasa pobierająca wysztkich rejestratorów
router.get('/view-all-registrars', protect, async (request, response) => {
    try {

      const isUserAdmin = await isAdmin(request.user._id);
        
      if (!isUserAdmin) {
          return response.status(403).json({ message: 'Brak uprawnień administratora' });
      }

        const allRegistrars = await User.find({
          role: { $eq: 'registrar' }
        });
        return response.status(200).json(allRegistrars);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa do pobierania jednego rejestratora
router.get('/view-one-registrar/:_id', protect, async (request, response) => {
  try {
      const isUserAdmin = await isAdmin(request.user._id);

      if (!isUserAdmin) {
        return response.status(403).json({ message: 'Brak uprawnień administratora' });
      }

      const { _id: idFromURL } = request.params;

      //Walidacja _id z URL
      if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
        return response.status(404).json({ message: 'Nie znaleziono rejestratora - niepoprawne ID' });
      }

      const readRegistrar = await User.findById({_id: idFromURL});
      if (readRegistrar !== 'registrar') {
        return response.status(400).json({ message: 'Podany użytkownik nie jest rejestratorem' });
      }

      return response.status(200).json(readRegistrar);
  } catch (error) {
      console.log(error.message);
      response.status(500).send({message: error.message});
  }
}); 



//Trasa do blokowania użytkowników przez administratora
router.put('/block-registrar/:_id', protect, async (request, response) => {
    try {
      const isUserAdmin = await isAdmin(request.user._id);
      if (!isUserAdmin) {
        return response.status(403).json({ message: 'Brak uprawnień administratora' });
      }
  
      const { _id: idFromURL} = request.params;
  
      //Walidacja _id z URL
      if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
        return response.status(404).json({ message: 'Nie znaleziono użytkownika o podanym Id do zablokowania - Niepoprawne ID' });
        }
      
      const user = (await User.findById({_id: idFromURL}));

      if (!user) {
        return response.status(404).send({
          message: 'Nie znaleziono użytkownika o podanym Id do zablokowania' 
        });
      }

      if (user?.role === 'admin' || user?.role === 'superadmin') {
        return response.status(403).json({ message: 'Nie możesz zablokować administratora ani Superadministratora. Konto administratora może zablokować tylko Super Administrator.' });
      }
  
      if (user?.isActive === false) {
        return response.status(400).json({ message: 'Rejestrator jest już zablokowany' });
      }
  
      //Zablokuj rejestratora
  
      const blockRegistrar = await User.findByIdAndUpdate(idFromURL, {isActive: false}, {new: true});
  
      if (!blockRegistrar) {
        return response.status(500).json({ message: 'Błąd, nie udało się zablokować rejestratora' });
      }
  
      return response.status(200).send({message: 'Zablokowano rejestratora'});
  
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
  
      // Walidacja _id z URL
      if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
        return response.status(404).json({ message: 'Nie znaleziono rejestratora o podanym Id do odblokowania - Niepoprawne ID' });
        }
      
      const user = (await User.findById({_id: idFromURL}))

      if (!user) {
        return response.status(404).send({
          message: 'Nie znaleziono rejestratora o podanym Id do odblokowania' 
        });
      }

      if (user?.role === 'admin' || user?.role === 'superadmin') {
        return response.status(403).json({ message: 'Nie możesz odblokować administratora ani Superadministratora. Konto administratora może odblokować tylko Super Administrator.' });
      }
  
      if (user?.isActive === true) {
        return response.status(400).json({ message: 'Podany rejestrator nie jest zablokowany' });
      }
  
      //Odlokuj rejestratora
      const unblockRegistrar = await User.findByIdAndUpdate(idFromURL, {isActive: true}, {new: true});
  
      if (!unblockRegistrar) {
        return response.status(500).json({ message: 'Błąd, nie udało się odblokować rejestratora' });
      }
  
      return response.status(200).send({message: 'Odblokowano rejestratora'});
  
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
  });

export default router;
