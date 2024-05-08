import fs from 'fs';
import NodeRSA from 'node-rsa';

export const desencriptar = function (dato) {
    const key = new NodeRSA();
    const privada = fs.readFileSync('configuraciones/private.pem');
    key.importKey(privada);
    return key.decrypt(dato, 'utf8');
}