import jwt from 'jsonwebtoken';

const comprobarToken = function (userToken, seedBot) {
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

const signToken = (expires, config, seed, algoritmo) => {
    let opts = { algorithm: algoritmo || 'HS256', expiresIn: expires };
    return jwt.sign({ config }, seed, opts);
}

export default { comprobarToken, signToken };