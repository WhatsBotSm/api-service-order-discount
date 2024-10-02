export const generarCadena = (payload) => {
    const payloadAplanado = aplanarObjeto(payload);
    return Object.values(payloadAplanado)
        .map(valor => valor.toString().trim())
        .join("|"); 
}

function aplanarObjeto(obj, prefijo = '') {
    return Object.entries(obj).reduce((acumulado, [clave, valor]) => {
        const nuevaClave = prefijo ? `${prefijo}.${clave}` : clave;
        if (valor && typeof valor === "object") {
            if (Array.isArray(valor)) {
                valor.forEach((elemento, indice) => {
                    const claveElemento = `${nuevaClave}[${indice}]`;
                    if (elemento && typeof elemento === "object") {
                        Object.assign(acumulado, aplanarObjeto(elemento, claveElemento));
                    } else {
                        acumulado[claveElemento] = elemento;
                    }
                });
            } else {
                Object.assign(acumulado, aplanarObjeto(valor, nuevaClave));
            }
        } else {
            acumulado[nuevaClave] = valor;
        }
        return acumulado;
    }, {});
}
