import express from "express";
import mongoose from 'mongoose';
import visitsRoute from './routes/visitsRoute.js';
import doctorRoutes from './routes/doctorRoutes.js';
import userRoutes from './routes/user/userRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS POLICY
app.use(cors());
/*app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type']
    }));
*/

app.get('/', (request, response) => {
    console.log(request);
    return response.status(235).send('Odpowiedx');
});

app.use('/api/visits', visitsRoute);
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Aplikacja została połączona z bazą danych');
        app.listen(process.env.PORT, () => {
            console.log(`Aplikacja nasłuchuje portu: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });