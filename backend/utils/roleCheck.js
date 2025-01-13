import { User } from '../models/userModel.js';

const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');
        return user?.role === 'admin';
    } catch (error) {
        console.error('Błąd podczas weryfikacji uprawnień administartora: ', error);
        return false;
    }
};

const isRegistrar = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');
        return user?.role === 'registrar';
    } catch (error) {
        console.error('Błąd podczas weryfikacji uprawnień rejestratora: ', error);
        return false;
    }
};

const isSuperAdmin = async (userId) => {
    try {
        const user = await User.findById(userId).select('role');
        return user?.role === 'superadmin';
    } catch (error) {
        console.error('Błąd podczas weryfikacji uprawnień super administratora: ', error);
        return false;
    }
};

export { isAdmin, isRegistrar, isSuperAdmin };