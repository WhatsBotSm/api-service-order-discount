![enter image description here](https://avatars.githubusercontent.com/u/77294778?s=200&v=4)
# 🚀 **API de Descuentos**

## 🗂️ Estructura del Proyecto
```plaintext
src/
├── configuraciones/     # ⚙️ Configuraciones y variables del entorno
├── controladores/       # 🎛️ Lógica principal de los controladores
├── dao/                 # 📦 Acceso a la base de datos (Data Access Object)
├── funciones/           # 🔨 Funciones auxiliares reutilizables
├── middlewares/         # 🛡️ Middleware para validaciones y seguridad
├── rutas/               # 🗺️ Definición de las rutas de la API
├── servicios/           # 🔧 Servicios que manejan la lógica del negocio
test/
├── newApp.sh          # ✅ Script de creación fly
├── validate.sh          # ✅ Script de validación fly
```

## 📋 Requisitos
Antes de comenzar, asegúrate de tener lo siguiente:

- 🛠️ **Node.js** v20 o superior
- 📦 **npm** o **yarn** para gestionar las dependencias
- 🐳 **Docker** (opcional, para despliegue con contenedores)
  
## 🚀 Inicio Rápido

Sigue estos pasos para ejecutar la API localmente:
1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/WhatsBotSm/api-service-order-discount.git
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Duplica el archivo `.env.example` y renómbralo a `.env`. Luego, completa las variables necesarias.

   ```bash
   cp .env.example .env
   ```

4. **Inicia el servidor en modo desarrollo:**
   ```bash
   npm run devmode
   ```

5. **Accede a la API:**
   Tu API estará disponible en `http://localhost:PORT/BASE_API` 🚀

## 🐋 Despliegue con Docker

Si prefieres usar Docker, puedes construir y ejecutar la API en un contenedor.

1. **Construir la imagen Docker:**
   ```bash
   docker build -t api-service-order-discount-v1 .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 api-service-order-discount-v1
   ```

## ✍️ Scripts Disponibles

- `npm run devmode` - Inicia el servidor en modo desarrollo 🛠️
- `npm run start` - Inicia la aplicación en modo producción 🚀
- `npm run test` - Ejecuta las pruebas 🧪

## 📚 Documentación de la API

Para explorar la documentación de los endpoints, abre el archivo `swagger.js` o accede a la documentación interactiva en `http://localhost:PORT/BASE_API/docs`. ✨

## 🧑‍💻 Contribuciones

Para contribuir al proyecto, por favor sigue estos pasos:

1. Haz un checkout a la rama `develop`.
2. Crea una nueva rama con tu nombre (`git checkout -b nombre/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin nombre/nueva-funcionalidad`).
5. Crea un Pull Request a `develop` y luego a `stage-dev`🚀.

## 🛠️ Herramientas utilizadas

- **Express.js** - Framework para crear la API.
- **PM2** - Administrador de procesos para mantener la API en producción.
- **Docker** - Para contenerizar la aplicación y facilitar su despliegue.

## 📄 

<strong>Autor:</strong> Carlos Rivas Frutero<br>
<strong>Email:</strong> [crivas@whatsbot.com.mx](crivas@whatsbot.com.mx)<br>
<strong>Fecha:</strong> 22-03-2024<br>
