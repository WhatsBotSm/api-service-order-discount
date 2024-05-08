import jwt from 'jsonwebtoken';

const comprobratToken = function (userToken, seedBot) {
    try {
        return jwt.verify(userToken, seedBot, (err, decoded) => {
            if (err) {
                return false;
            } else {
                return decoded;
            }
        });
    } catch (err) {
        return false;
    }
};

const signToken = (expires, config, seed) => {
    return jwt.sign(
        { config }, seed,
        { expiresIn: expires });
}

export default { comprobratToken, signToken }