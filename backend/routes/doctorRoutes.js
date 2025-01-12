import express from 'express';
import mongoose from 'mongoose';
import { Doctor, allowedSpecializations } from '../models/doctorModel.js';
import { isRegistrar } from '../utils/roleCheck.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for Save a Doctor
router.post('/add-doctor', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { doctorName, specialization} = request.body;
        if (!doctorName || !specialization || !doctorName.trim() || !specialization.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: doctorName i specialization. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }
        
        const newDoctor = new Doctor({
            doctorName: doctorName, 
            specialization: specialization
        });
        
        const createdDoctor = await newDoctor.save();
        return response.status(201).send(createdDoctor);
    } catch (error) {
        console.log(error.message);
        if (error.code === 11000) {
            response.status(409).send({ message: 'Lekarz z takim imieniem, nazwiskiem i specjalizacją już istnieje.' });
        } else if (error.name === 'ValidationError') {
            response.status(400).send({ message: `Nieprawidłowa specjalizacja. Dozwolone specjalizacje to:\n${allowedSpecializations.join(', ')}` });
        } else {
            response.status(500).send({message: error.message});
        }
    }
});

// Route for Get All Doctors
router.get('/view-all-doctors', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const allDoctors = await Doctor.find({});
        return response.status(200).json({
            data: allDoctors
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Get One Doctor from database by id
router.get('/view-one-doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id } = request.params;

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        const readDoctor = await Doctor.findById({_id});
        return response.status(200).json(readDoctor);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Update Doctor
router.put('/update-doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;
        const { doctorName, specialization } = request.body;

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        // Check for empty fields or fields with only whitespace
        if (!doctorName || !specialization || !doctorName.trim() || !specialization.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: doctorName i specialization. Pola w zapytaniu nie mogą zawierać tylko białych znaków'
            });
        }

        // Check if the specialization is valid
        if (!allowedSpecializations.includes(specialization)) {
            return response.status(400).send({
                message: `Niepoprawna specjalizacja, wybierz jedną z dozwolonych: ${allowedSpecializations.join(', ')}`
            });
        }

        // Check if another doctor with the same name and specialization already exists
        const existingDoctor = await Doctor.findOne({
            doctorName: doctorName,
            specialization: specialization,
            _id: { $ne: idFromURL }  // Exclude the current doctor being updated
        });

        if (existingDoctor) {
            return response.status(409).send({
                message: 'Inny lekarz z tą samą nazwą i specjalizacją już istnieje'
            });
        }

        // Update the doctor
        const updateData = { doctorName, specialization };
        const updatedDoctor = await Doctor.findByIdAndUpdate(idFromURL, updateData, {new: true});
        if (!updatedDoctor) {
            return response.status(404).send({
                message: 'Nie znaleziono lekarza do aktualizacji'
            });
        }

        response.status(200).send(updatedDoctor);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for delete doctor
router.delete('/delete_doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id } = request.params;

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        const result = await Doctor.findByIdAndDelete(_id);
        if (!result) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza'});
        }
        return response.status(200).send({message: 'Usunięto lekarza'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

export default router;