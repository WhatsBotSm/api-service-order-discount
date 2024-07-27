const emailExample = "suca@motudo.com";
const tokenExample = "dksdhw872387617hdsbi82g-232-2332231";
const ipExample = "10.10.10.10";
const nameExample = "Juan pablo Garcia perez";

const mensajeExito = "Operación exitosa";

export default {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "api-whatsbotsm-order"
  },
  "host": "10.20.22.23:8091",
  "basePath": "/api_bot/order",
  "tags": [
    {
      "name": "Servicio de Pedidos whatsbotsm",
      "description": "Servicios On Premise para pedidos de whatsbotsm"
    }
  ],
  "schemes": [
    "http"
  ],
  "paths": {
    "/agente/c/": {
      "post": {
        "tags": [
          "egress"
        ],
        "summary": "Egress",
        "description": "",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "header",
            "name": "nombre_aplicativo",
            "type": "string",
            "default": "whts-api",
            "description": "nombre del aplicativo que consume el servicio",
            "required": true
          },
          {
            "in": "header",
            "name": "identificador_usuario",
            "type": "string",
            "default": "UsuarioX",
            "description": "identificador del usuario que manda a llamar el servicio",
            "required": true
          },
          {
            "in": "body",
            "required": true,
            "name": "body",
            "schema": {
              "$ref": "#/definitions/datos"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "OK.",
            "schema": {
              "$ref": "#/definitions/201_mensaje"
            }
          },
          "400": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/400_mensaje"
            }
          },
          "404": {
            "description": "Bad Request",
            "schema": {
              "$ref": "#/definitions/404_mensaje"
            }
          },
          "500": {
            "description": "Internal Server Error",
            "schema": {
              "$ref": "#/definitions/500_mensaje"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "datos": {
      "type": "object",
      "required": [
        "client_id",
        "person_type",
        "curp",
        "rfc",
        "email",
        "account",
        "maximum_amount",
        "token",
        "ip",
        "agent",
        "tipo_whatsbotsmcto",
        "origen",
        "name",
        "institution_code",
        "account_type",
        "alias"
      ],
      "properties": {
        "client_id": {
          "type": "integer",
          "example": 666,
          "default": 666,
          "description": "Identificador de cliente beneficiario"
        },
        "person_type": {
          "type": "string",
          "example": "F",
          "default": "F",
          "description": "Definición de género en términos biológicos del beneficiario, el cual se identifica como “F” para femenino y “M” para masculino"
        },
        "curp": {
          "type": "string",
          "example": "SABC560626MDFLRN09",
          "default": "SABC560626MDFLRN09",
          "description": "CURP de beneficiario"
        },
        "rfc": {
          "type": "string",
          "example": "XAXE760823XXX",
          "default": "XAXE760823XXX",
          "description": "RFC de beneficiario"
        },
        "email": {
          "type": "string",
          "example": emailExample,
          "default": emailExample,
          "description": "Dirección de correo electrónico de beneficiario"
        },
        "account": {
          "type": "string",
          "example": "11111",
          "default": "11111",
          "description": "Numero de cuneta del beneficiario"
        },
        "maximum_amount": {
          "type": "number",
          "example": 10000,
          "default": 10000,
          "description": "Monto máximo de transferencia al beneficiario"
        },
        "token": {
          "type": "string",
          "example": tokenExample,
          "default": tokenExample,
          "description": "token-string"
        },
        "ip": {
          "type": "string",
          "example": ipExample,
          "default": ipExample,
          "description": "Dirección IP del dispositivo desde el cual se está realizando la transacción"
        },
        "agent": {
          "type": "string",
          "example": "root",
          "default": "root",
          "description": "agent-string"
        },
        "tipo_whatsbotsmcto": {
          "type": "string",
          "example": "temporal",
          "default": "temporal",
          "description": "Tipo de whatsbotsmcto beneficiario"
        },
        "origen": {
          "type": "string",
          "example": "MB",
          "default": "MB",
          "description": "Origen de la transacción “MB” para mismo bot y “OB” para otro bot"
        },
        "name": {
          "type": "string",
          "example": nameExample,
          "default": nameExample,
          "description": "Nombre de la persona beneficiaria"
        },
        "institution_code": {
          "type": "string",
          "example": "009873",
          "default": "009873",
          "description": "Código de la institución beneficiaria"
        },
        "account_type": {
          "type": "string",
          "example": "10",
          "default": "10",
          "description": "Tipo de la cuenta beneficiaria"
        },
        "alias": {
          "type": "string",
          "example": "Eli",
          "description": "alias del beneficiarioa"
        }
      }
    },
    "datos_put": {
      "type": "object",
      "required": [
        "client_id",
        "person_type",
        "curp",
        "rfc",
        "email",
        "account",
        "maximum_amount",
        "token",
        "ip",
        "agent",
        "tipo_whatsbotsmcto",
        "origen",
        "name",
        "institution_code",
        "account_type",
        "alias"
      ],
      "properties": {
        "whatsbotsmct_id": {
          "type": "integer",
          "example": 60,
          "default": 60,
          "description": "Identificador del whatsbotsmcto"
        },
        "client_id": {
          "type": "integer",
          "example": 666,
          "default": 666,
          "description": "Identificador de cliente beneficiario"
        },
        "person_type": {
          "type": "string",
          "example": "M",
          "default": "M",
          "description": "Definición de género en términos biológicos del beneficiario, el cual se identifica como “F” para femenino y “M” para masculino"
        },
        "curp": {
          "type": "string",
          "example": "SABC560626MDFLRN09",
          "default": "SABC560626MDFLRN09",
          "description": "CURP de beneficiario"
        },
        "rfc": {
          "type": "string",
          "example": "XAXE760823XXX",
          "default": "XAXE760823XXX",
          "description": "RFC de beneficiario"
        },
        "email": {
          "type": "string",
          "example": "ijruizm@motudo.com",
          "default": "ijruizm@motudo.com",
          "description": "Dirección de correo electrónico de beneficiario"
        },
        "account": {
          "type": "string",
          "example": "11111",
          "default": "11111",
          "description": "Numero de cuneta del beneficiario"
        },
        "maximum_amount": {
          "type": "number",
          "example": 10000,
          "default": 10000,
          "description": "Monto máximo de transferencia al beneficiario"
        },
        "token": {
          "type": "string",
          "example": tokenExample,
          "default": tokenExample,
          "description": "token-astring"
        },
        "ip": {
          "type": "string",
          "example": "10.10.10.13",
          "default": "10.10.10.13",
          "description": "Dirección IP del dispositivo desde el cual se está realizando la transacción"
        },
        "agent": {
          "type": "string",
          "example": "root",
          "default": "root",
          "description": "aagent-string"
        },
        "tipo_whatsbotsmcto": {
          "type": "string",
          "example": "temporal",
          "default": "temporal",
          "description": "Tipo de whatsbotsmcto beneficiario"
        },
        "origen": {
          "type": "string",
          "example": "MB",
          "default": "MB",
          "description": "Origen de la transacción “MB” para mismo bot y “OB” para otro bot"
        },
        "name": {
          "type": "string",
          "example": "Jesus Calderón",
          "default": "Jesus Calderón",
          "description": "Nombre de la persona beneficiaria"
        },
        "institution_code": {
          "type": "string",
          "example": "009873",
          "default": "009873",
          "description": "Código de la institución beneficiaria"
        },
        "account_type": {
          "type": "string",
          "example": "10",
          "default": "10",
          "description": "Tipo de la cuenta beneficiaria"
        },
        "alias": {
          "type": "string",
          "example": "Eli",
          "description": "alias del beneficiariob"
        }
      }
    },
    "whatsbotsmcto": {
      "type": "object",
      "properties": {
        "whatsbotsmct_id": {
          "type": "integer",
          "example": 666,
          "default": 666
        },
        "client_id": {
          "type": "integer",
          "example": 666,
          "default": 666
        },
        "person_type": {
          "type": "string",
          "example": "F",
          "description": "F = Fisica, M = Moral"
        },
        "curp": {
          "type": "string",
          "example": "SABC560626MDFLRN09",
          "default": "SABC560626MDFLRN09"
        },
        "rfc": {
          "type": "string",
          "example": "XAXE760823XXX",
          "default": "XAXE760823XXX"
        },
        "email": {
          "type": "string",
          "example": emailExample,
          "default": emailExample
        },
        "account": {
          "type": "string",
          "example": "11111",
          "default": "11111"
        },
        "maximum_amount": {
          "type": "number",
          "example": 10000,
          "default": 10000
        },
        "token": {
          "type": "string",
          "example": tokenExample,
          "default": tokenExample
        },
        "ip": {
          "type": "string",
          "example": ipExample,
          "default": ipExample
        },
        "agent": {
          "type": "string",
          "example": "root",
          "default": "root"
        },
        "tipo_whatsbotsmcto": {
          "type": "string",
          "example": "temporal",
          "default": "temporal"
        },
        "estatus": {
          "type": "integer",
          "example": 1,
          "description": "1 = activo, 2 = inactivo"
        },
        "fecha_creacion": {
          "type": "string",
          "example": "2019-08-26T15:38:49.007Z",
          "default": "2019-08-26T15:38:49.007Z"
        },
        "fecha_actualizacion": {
          "type": "string",
          "example": "2019-08-26T15:43:35.282Z",
          "default": "2019-08-26T15:43:35.282Z"
        },
        "origen": {
          "type": "string",
          "example": "MB",
          "default": "MB",
          "description": "MB = mismo bot, OB = Otro bot"
        },
        "name": {
          "type": "string",
          "example": nameExample,
          "default": nameExample
        },
        "institution_code": {
          "type": "string",
          "example": "009873",
          "default": "009873"
        },
        "account_type": {
          "type": "string",
          "example": "10",
          "default": "10"
        },
        "alias": {
          "type": "string",
          "example": "Eli",
          "description": "alias del beneficiarioc"
        }
      }
    },
    "whatsbotsmcto_id": {
      "type": "object",
      "properties": {
        "whatsbotsmcto_id": {
          "type": "integer"
        }
      }
    },
    "200_mensaje_get_whts-api": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": mensajeExito
        },
        "resultObject": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/whatsbotsmcto"
          }
        }
      }
    },
    "200_mensaje": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": mensajeExito
        },
        "resultObject": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "example": []
        }
      }
    },
    "201_mensaje": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": mensajeExito
        },
        "resultObject": {
          "type": "array",
          "items": {
            "type": "object",
            "$ref": "#/definitions/whatsbotsmcto_id"
          }
        }
      }
    },
    "400_mensaje": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": "Datos incorrectos"
        },
        "resultObject": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "example": []
        }
      }
    },
    "404_mensaje": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": "No se encontraron resultados"
        },
        "resultObject": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "example": []
        }
      }
    },
    "500_mensaje": {
      "type": "object",
      "properties": {
        "mensaje": {
          "type": "string",
          "example": "Ocurrió un error al procesar datos"
        },
        "resultObject": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "example": []
        }
      }
    }
  },
  "securityDefinitions": {
    "apikey": {
      "name": "tokenHeader",
      "type": "apiKey",
      "in": "header"
    }
  }
}