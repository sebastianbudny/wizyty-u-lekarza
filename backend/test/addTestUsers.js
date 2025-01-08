import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { mongoDBURL } from '../config.js';

const addTestUsers = async () => {
  try {
    await mongoose.connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Połączono z bazą danych');

    // Usuń istniejących użytkowników
    await User.deleteMany();

    // Dodaj użytkowników testowych
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin',
        status: 'approved',
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'user',
        role: 'rejestrator',
        status: 'approved',
      },
    ];

    await User.insertMany(users);

    console.log('Użytkownicy testowi zostali dodani');
    mongoose.connection.close();
  } catch (error) {
    console.error('Błąd podczas dodawania użytkowników testowych:', error);
    mongoose.connection.close();
  }
};

addTestUsers();