import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (request, response, next) => {
    if (request.path === '/login' || request.path === '/register') {
        return next();
    }
    const { authorization } = request.headers;
    console.log("authorization", authorization);

    if (!authorization) {
        return response.status(401).json({ message: 'Brak autoryzacji z powodu braku tokenu' });
    }
    const token = authorization.split(" ")[1];
    console.log("token", token);

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;
        console.log("_id:", _id);
        request.user = await User.findOne({ _id }).select("_id");
        console.log("Użytkownik został pomyślnie zautoryzowany");
        next();
    } catch (error) {
        console.log(error.message);
         return response.status(401).json({ message: 'Błąd podczas autoryzacji' });
    }
};
export { protect };