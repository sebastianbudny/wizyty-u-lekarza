import mongoose, { Schema } from "mongoose";

export const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const visitSchema = mongoose.Schema(
    {
        visitDate: {
            type: Date,
            required: true
        },
        visitTime: {
            type: String,
            required: true,
            enum: {
                values: validHours,
                message: `{VALUE} nie może być godziną wizyty. Dozwolone godziny {PATH} to: ${validHours.join(', ')}`
            }
        },
        patient: {
            type: String,
            required: true
        },
        purpose: {
            type: String,
            required: true
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        }
    },
    {
        timestamps: true
    }
);

visitSchema.index({ doctor: 1, visitDate: 1, visitTime: 1 }, { unique: true });

visitSchema.index({ patient: 1, visitDate: 1, visitTime: 1 }, { unique: true });

export const Visit = mongoose.model('Visit', visitSchema);
