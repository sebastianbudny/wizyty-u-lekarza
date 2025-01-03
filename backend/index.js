import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import visitsRoute from './routes/visitsRoute.js';
import doctorRoutes from './routes/doctorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import cors from 'cors';

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
app.use('/api/emails', emailRoutes);
app.use('/api/requests', requestRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Aplikacja została połączona z bazą danych');
        app.listen(PORT, () => {
            console.log(`Aplikacja nasłuchuje portu: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })