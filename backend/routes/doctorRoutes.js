import express from 'express';
import mongoose from 'mongoose';
import { Doctor, allowedSpecializations } from '../models/doctorModel.js';
import { isRegistrar } from '../utils/roleCheck.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//Trasa do pobierania wszystkich lekarzy
router.get('/view-all-doctors', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const allDoctors = await Doctor.find({});
        return response.status(200).json(allDoctors);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa do pobierania jednego lekarza
router.get('/view-one-doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        const readDoctor = await Doctor.findById({_id: idFromURL});
        return response.status(200).json(readDoctor);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa do dodawania lekarza
router.post('/add-doctor', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { doctorName, specialization} = request.body;

        //Walidacja wymaganych pól
        if (!doctorName || !specialization || !doctorName.trim() || !specialization.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: doctorName i specialization. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }

        //Waliadacja specjalizacji
        if (!allowedSpecializations.includes(specialization)) {
            return response.status(400).send({
                message: `Niepoprawna specjalizacja, wybierz jedną z dozwolonych: ${allowedSpecializations.join(', ')}`
            });
        }

        //Sprawdzenie, czy inny lekarz o takiej samej nazwie i specjalizacji już istnieje
        const existingDoctor = await Doctor.findOne({
            doctorName: doctorName,
            specialization: specialization
        });

        if (existingDoctor) {
            return response.status(409).send({
                message: 'Inny lekarz z tą samą nazwą i specjalizacją już istnieje'
            });
        }
        
        //Dodanie lekarza
        const newDoctor = new Doctor({
            doctorName: doctorName, 
            specialization: specialization
        });
        
        //Zapisanie lekarza
        const createdDoctor = await newDoctor.save();
        return response.status(201).send(createdDoctor);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa do aktualizacji lekarza
router.put('/update-doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;
        const { doctorName, specialization } = request.body;

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        //Walidacja wymaganych pól
        if (!doctorName || !specialization || !doctorName.trim() || !specialization.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: doctorName i specialization. Pola w zapytaniu nie mogą zawierać tylko białych znaków'
            });
        }

        //Waliadacja specjalizacji
        if (!allowedSpecializations.includes(specialization)) {
            return response.status(400).send({
                message: `Niepoprawna specjalizacja, wybierz jedną z dozwolonych: ${allowedSpecializations.join(', ')}`
            });
        }

        //Sprawdzenie, czy inny lekarz o takiej samej nazwie i specjalizacji już istnieje
        const existingDoctor = await Doctor.findOne({
            doctorName: doctorName,
            specialization: specialization,
            _id: { $ne: idFromURL } 
        });

        if (existingDoctor) {
            return response.status(409).send({
                message: 'Inny lekarz z tą samą nazwą i specjalizacją już istnieje'
            });
        }

        //Aktualizacja lekarza
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

//Trasa do usuwania lekarza
router.delete('/delete_doctor/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID' });
        }

        //Usuwanie lekarza
        const result = await Doctor.findByIdAndDelete(idFromURL);
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