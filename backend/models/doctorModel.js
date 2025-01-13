import mongoose from "mongoose";

export const allowedSpecializations = [
    "Alergologia", "Anestezjologia i intensywna terapia", "Angiologia", "Audiologia i foniatria", "Balneologia i medycyna fizykalna", 
    "Chirurgia dziecięca", "Chirurgia klatki piersiowej", "Chirurgia naczyniowa", "Chirurgia ogólna", "Chirurgia onkologiczna", 
    "Chirurgia plastyczna", "Chirurgia szczękowo-twarzowa", "Choroby płuc", "Choroby płuc dzieci", "Choroby wewnętrzne", 
    "Choroby zakaźne", "Dermatologia i wenerologia", "Diabetologia", "Diagnostyka laboratoryjna", "Endokrynologia", 
    "Endokrynologia ginekologiczna i rozrodczość", "Endokrynologia i diabetologia dziecięca", "Epidemiologia", "Farmakologia kliniczna", 
    "Gastroenterologia", "Gastroenterologia dziecięca", "Genetyka kliniczna", "Geriatria", "Ginekologia onkologiczna", "Hematologia", 
    "Hipertensjologia", "Immunologia kliniczna", "Intensywna terapia", "Kardiochirurgia", "Kardiologia", "Kardiologia dziecięca", 
    "Medycyna lotnicza", "Medycyna morska i tropikalna", "Medycyna nuklearna", "Medycyna paliatywna", "Medycyna pracy", 
    "Medycyna ratunkowa", "Medycyna rodzinna", "Medycyna sądowa", "Medycyna sportowa", "Mikrobiologia lekarska", 
    "Nefrologia", "Nefrologia dziecięca", "Neonatologia", "Neurochirurgia", "Neurologia", "Neurologia dziecięca", 
    "Neuropatologia", "Okulistyka", "Onkologia i hematologia dziecięca", "Onkologia kliniczna", "Ortopedia i traumatologia narządu ruchu", 
    "Otorynolaryngologia", "Otorynolaryngologia dziecięca", "Patomorfologia", "Pediatria", "Pediatria metaboliczna", "Perinatologia", 
    "Położnictwo i ginekologia", "Psychiatria", "Psychiatria dzieci i młodzieży", "Radiologia i diagnostyka obrazowa", 
    "Radioterapia onkologiczna", "Rehabilitacja medyczna", "Reumatologia", "Seksuologia", "Toksykologia kliniczna", 
    "Transfuzjologia kliniczna", "Transplantologia kliniczna", "Urologia", "Urologia dziecięca", "Zdrowie publiczne"];

const doctorSchema = mongoose.Schema(
    {
        doctorName: {
            type: String,
            required: true,
            trim: true
        },
        specialization: {
            type: String,
            required: true,
            enum: {
                values: allowedSpecializations,
                message: `{VALUE} Nie jest prawidłową specjalizacją. Wybierz jedną ze spacjalizacji: ${allowedSpecializations.join(', ')}`
            }
        }
    },
    {
        timestamps: true
    }
);

doctorSchema.index({ doctorName: 1, specialization: 1 }, { unique: true });

export const Doctor = mongoose.model('Doctor', doctorSchema);
