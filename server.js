const express = require('express');
const path = require('path');

const app = express();

// Define la ruta a la carpeta 'dist/gestion-contador-frontend-no-standalone/browser'
const distPath = path.join(__dirname, 'dist', 'gestion-contador-frontend-no-standalone', 'browser');

// Sirve los archivos estáticos desde la carpeta 'browser'
app.use(express.static(distPath));

// Fallback para manejar todas las rutas y servir el 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Establece el puerto en Heroku o 8080 por defecto
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
