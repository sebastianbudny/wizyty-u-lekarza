import express from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import { Visit, validHours } from '../models/visitModel.js';
import { Doctor } from '../models/doctorModel.js';
import { isRegistrar } from '../utils/roleCheck.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

function isValidDate(date) {
    return moment(date, 'YYYY-MM-DD', true).isValid();
}

// Route for Save a new Visit
router.post('/add-visit', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { visitDate, visitTime, purpose, idDoctor, patient } = request.body;

        // Validate required fields
        if (!visitDate || !visitTime || !purpose || !idDoctor || !patient || !visitDate.trim() || !visitTime.trim() || !purpose.trim() || !idDoctor.trim() || !patient.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: visitDate, visitTime, purpose, idDoctor i patient. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }

        if (!isValidDate(visitDate)) {
            return response.status(400).send({
                message: 'Nieprawidłowa data, data musi być podana w formacie YYYY-MM-DD'
            });
        }

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(idDoctor)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID lekarza' });
        }

        // Validate that the doctor exists in the database by name
        const doctorExists = await Doctor.findById({ _id: idDoctor });
        if (!doctorExists) {
            return response.status(404).send({
                message: 'Podany lekarz o id ' + idDoctor + ' nie istnieje w bazie danych'
            });
        }
        
        const newVisit = new Visit({
            visitDate: visitDate,
            visitTime: visitTime,
            patient: patient,
            purpose: purpose,
            doctor: doctorExists._id  // Link the visit to the doctor's ObjectId
        });

        const createVisit = await newVisit.save();
        return response.status(201).send(createVisit);
    } catch (error) {
        console.log(error.message);
        if (error.code === 11000) {
            response.status(409).send({ message: 'Wizyta o tej godzinie w danym dniu dla danego LEKARZA już istnieje lub/i wizyta o tej godzinie w danym dniu dla danego PACJENTA już istnieje. ' });
        } else if (error.name === 'ValidationError') {
            response.status(400).send({ message: `Nieprawidłowa godzina wizyty. Dozwolone godziny to: ${validHours.join(', ')}` });
        } else {
            response.status(500).send({message: error.message});
        }
    }
});

// Route for Get All Visits
router.get('/view-all-visits', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const readVisits = await Visit.find({});
        return response.status(200).json({
            data: readVisits
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Get One Visit from database by id
router.get('/view-one-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id } = request.params;

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }
              
        const readVisit = await Visit.findById({_id});
        if (!readVisit) {
            return response.status(404).send({
                message: 'Nie znaleziono Wizyty po _id do wyświetlenia'
            });
        }

        return response.status(200).json(readVisit);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Update Visit
router.put('/update-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;
        const { visitDate, visitTime, patient, purpose, idDoctor } = request.body;

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }

        const checkIfExist = (await Visit.findById({_id: idFromURL}))
        if (!checkIfExist) {
            return response.status(404).send({
                message: 'Nie znaleziono Wizyty po _id do wyświetlenia'
            });
        }

        // Validate required fields
        if (!visitDate || !visitTime || !purpose || !idDoctor || !patient || !visitDate.trim() || !visitTime.trim() || !purpose.trim() || !idDoctor.trim() || !patient.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: visitDate, visitTime, purpose, idDoctor i patient. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }

        // Validate visitDate
        if (!isValidDate(visitDate)) {
            return response.status(400).send({
                message: 'Nieprawidłowa data, data musi być podana w formacie YYYY-MM-DD'
            });
        }

        // Validate visitTime is within valid hours
        if (!validHours.includes(visitTime)) {
            return response.status(400).send({
                message: `Nieprawidłowa godzina wizyty. Dozwolone godziny to: ${validHours.join(', ')}`
            });
        }

        // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(idDoctor)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID lekarza' });
        }

        // Validate that the doctor exists in the database by name
        const doctorExists = await Doctor.findById({ _id: idDoctor });
        if (!doctorExists) {
            return response.status(404).send({
                message: 'Podany lekarz o id ' + idDoctor + ' nie istnieje w bazie danych'
            });
        }

        // Check if a visit already exists with the same date, time, and doctor
        const existingVisitDoctor = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            doctor: idDoctor,
            _id: { $ne: idFromURL }  // Exclude the current visit being updated
        });

        // Check if a visit already exists with the same date, time, and patient
        const existingVisitPatient = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            patient: patient,
            _id: { $ne: idFromURL }  // Exclude the current visit being updated
        });

        if (existingVisitDoctor || existingVisitPatient) {
            return response.status(409).send({
                message: 'Wizyta o tej godzinie w danym dniu dla danego LEKARZA już istnieje lub wizyta o tej godzinie w danym dniu dla danego PACJENTA już istnieje. '
            });
        }

        // Update the visit
        const updateData = { visitDate, visitTime, patient, purpose, doctor: idDoctor };
        const updatedVisit = await Visit.findByIdAndUpdate(idFromURL, updateData, { new: true});
        if (!updatedVisit) {
            return response.status(500).json({ message: 'Błąd: nie udało się zaktualizować wizyty.'});
        }

        return response.status(200).send({message: 'Zaktualizowano wizytę'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for delete Visit
router.delete('/delete-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id } = request.params;

         // Validate _id from URL
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }

        const checkIfExist = await Visit.findByIdAndDelete(_id);
        if (!checkIfExist) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty'});
        }
        return response.status(200).send({message: 'Usunięto wizytę'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

export default router;
