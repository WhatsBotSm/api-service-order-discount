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

const descuentosEsquema = {
    "type": "object",
    "properties": {
        "id_client_admin_bot": {
            "type": "integer"
        },
        "descripcion": {
            "type": "string",
            "pattern": regexPatternString,
        },
        "tipo_descuento": {
            "type": "string",
            "pattern": regexPatternString,
        },
        "valor": {
            "type": "integer"
        },
        "fecha_inicio": {
            "type": "string",
            "pattern": regexPatternString,
        },
        
        "codigo": {
            "type": "string",
            "pattern": regexPatternString,
        }
    },
    "required": [
        "id_client_admin_bot",
        "descripcion",
        "tipo_descuento",
        "valor",
        "fecha_inicio",
        "codigo"
    ]
};

export default { headerEsquema, bodyEsquema, descuentosEsquema }