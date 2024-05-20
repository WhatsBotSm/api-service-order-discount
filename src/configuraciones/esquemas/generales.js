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
        "idbot_control": {
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
        "fecha_fin": {
            "type": "string",
            "pattern": regexPatternString,
        },
        "codigo": {
            "type": "string",
            "pattern": regexPatternString,
        },
        "id_producto": {
            "type": "integer"
        },
    },
    "required": [
        "id_client_admin_bot",
        "idbot_control",
        "descripcion",
        "tipo_descuento",
        "valor",
        "fecha_inicio",
        "fecha_fin",
        "codigo",
        "id_producto"
    ]
};

export default { headerEsquema, bodyEsquema, descuentosEsquema }