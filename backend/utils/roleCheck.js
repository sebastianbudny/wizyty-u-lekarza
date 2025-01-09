import User from '../models/userModel.js';

export const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');
        return user?.role === 'admin';
    } catch (error) {
        console.error('Błąd podczas weryfikacji uprawnień administartora: ', error);
        return false;
    }
};

export const isRegistrar = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');
        return user?.role === 'rejestrator';
    } catch (error) {
        console.error('Błąd podczas weryfikacji uprawnień rejestratora: ', error);
        return false;
    }
};