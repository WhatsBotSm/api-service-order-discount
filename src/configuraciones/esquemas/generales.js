const regexPatternString = "^(?![nN][uU][lL]{2}$)\\s*\\S.*";
const headerEsquema = {
    "type": "object",
    "properties": {
        "nombre_aplicativo": {
            "type": "string",
            "pattern": regexPatternString,

        },
        "identificador_usuario": {
            "type": "string",
            "pattern": regexPatternString,
        }
    },
    "required": [
        "nombre_aplicativo",
        "identificador_usuario"
    ]
};

const bodyEsquema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "pattern": regexPatternString,
        }
    },
    "required": [
        "name"
    ]
};

export default { headerEsquema, bodyEsquema }