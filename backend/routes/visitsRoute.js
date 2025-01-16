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

//Trasa dla pobrania wszystkich wizyt
router.get('/view-all-visits', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const readVisits = await Visit.find({});
        return response.status(200).json(readVisits);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa dla pobrania jednej wizyty
router.get('/view-one-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }
              
        const readVisit = await Visit.findById({_id: idFromURL});
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

//Trasa dla dodawania wizyty
router.post('/add-visit', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { visitDate, visitTime, purpose, idDoctor, patient } = request.body;

        //Walidacja wymaganych pól
        if (!visitDate || !visitTime || !purpose || !idDoctor || !patient || !visitDate.trim() || !visitTime.trim() || !purpose.trim() || !idDoctor.trim() || !patient.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: visitDate, visitTime, purpose, idDoctor i patient. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }

        // Walidacja formatu daty
        if (!isValidDate(visitDate)) {
            return response.status(400).send({
                message: 'Nieprawidłowa data, data musi być podana w formacie YYYY-MM-DD'
            });
        }

        // Walidacja godziny wizyty
        if (!validHours.includes(visitTime)) {
            return response.status(400).send({
                message: `Nieprawidłowa godzina wizyty. Dozwolone godziny to: ${validHours.join(', ')}`
            });
        }

        //Walidacja _id lekarza
        if (!mongoose.Types.ObjectId.isValid(idDoctor)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID lekarza' });
        }

        //Sprawdzenie, czy lekarz istnieje
        const doctorExists = await Doctor.findById({ _id: idDoctor });
        if (!doctorExists) {
            return response.status(404).send({
                message: 'Podany lekarz o id ' + idDoctor + ' nie istnieje w bazie danych'
            });
        }

        //Sprawdzenie, czy instnieje wizyta w tym samym dniu i godzinie dla tego samego lekarza lub pacjenta
        const existingVisitDoctor = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            doctor: idDoctor                
        });

        const existingVisitPatient = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            patient: patient
        });

        if (existingVisitDoctor || existingVisitPatient) {
            return response.status(409).send({
                message: 'Wizyta o tej godzinie w danym dniu dla danego LEKARZA już istnieje lub wizyta o tej godzinie w danym dniu dla danego PACJENTA już istnieje. '
            });
        }
        
        //Stowrzenie nowej wizyty
        const newVisit = new Visit({
            visitDate: visitDate,
            visitTime: visitTime,
            patient: patient,
            purpose: purpose,
            doctor: doctorExists._id  //Link wizyty do ObjectId lekarza                                  
        });

        //Zapisanie wizyty
        const createVisit = await newVisit.save();
        return response.status(201).send(createVisit);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Trasa dla aktualizacji wizyty
router.put('/update-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;
        const { visitDate, visitTime, patient, purpose, idDoctor } = request.body;

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }

        const checkIfExist = (await Visit.findById({_id: idFromURL}))
        if (!checkIfExist) {
            return response.status(404).send({
                message: 'Nie znaleziono Wizyty po _id do wyświetlenia'
            });
        }

        //Walidacja wymaganych pól
        if (!visitDate || !visitTime || !purpose || !idDoctor || !patient || !visitDate.trim() || !visitTime.trim() || !purpose.trim() || !idDoctor.trim() || !patient.trim()) {
            return response.status(400).send({
                message: 'Podaj wszystkie wymagane pola: visitDate, visitTime, purpose, idDoctor i patient. Wartości wszystkich pól nie mogą zawierać tylko białych znaków'
            });
        }

        // Walidacja formatu daty
        if (!isValidDate(visitDate)) {
            return response.status(400).send({
                message: 'Nieprawidłowa data, data musi być podana w formacie YYYY-MM-DD'
            });
        }

        // Walidacja godziny wizyty
        if (!validHours.includes(visitTime)) {
            return response.status(400).send({
                message: `Nieprawidłowa godzina wizyty. Dozwolone godziny to: ${validHours.join(', ')}`
            });
        }

        //Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idDoctor)) {
            return response.status(404).json({ message: 'Nie znaleziono lekarza - niepoprawne ID lekarza' });
        }

        //Sprawdzenie, czy lekarz istnieje
        const doctorExists = await Doctor.findById({ _id: idDoctor });
        if (!doctorExists) {
            return response.status(404).send({
                message: 'Podany lekarz o id ' + idDoctor + ' nie istnieje w bazie danych'
            });
        }

        //Sprawdzenie, czy instnieje wizyta w tym samym dniu i godzinie dla tego samego lekarza lub pacjenta
        const existingVisitDoctor = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            doctor: idDoctor,
            _id: { $ne: idFromURL }                  
        });

        const existingVisitPatient = await Visit.findOne({
            visitDate: visitDate,
            visitTime: visitTime,
            patient: patient,
            _id: { $ne: idFromURL }
        });

        if (existingVisitDoctor || existingVisitPatient) {
            return response.status(409).send({
                message: 'Wizyta o tej godzinie w danym dniu dla danego LEKARZA już istnieje lub wizyta o tej godzinie w danym dniu dla danego PACJENTA już istnieje. '
            });
        }

        //Aktualizacja wizyty
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

// Trasa dla usunięcia wizyty
router.delete('/delete-visit/:_id', protect, async (request, response) => {
    try {
        const isUserReg = await isRegistrar(request.user._id);
                
        if (!isUserReg) {
            return response.status(403).json({ message: 'Brak uprawnień rejestratora' });
        }

        const { _id: idFromURL } = request.params;

         ///Walidacja _id z URL
        if (!mongoose.Types.ObjectId.isValid(idFromURL)) {
            return response.status(404).json({ message: 'Nie znaleziono wizyty - niepoprawne ID' });
        }

        //Usunięcie wizyty
        const checkIfExist = await Visit.findByIdAndDelete(idFromURL);
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
