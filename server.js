const express = require('express');
const path = require('path');

const app = express();

// Define la ruta a la carpeta 'browser'
const browserPath = path.join(__dirname, 'dist', 'gestion-contador-frontend-no-standalone', 'browser');

// Sirve archivos estáticos desde la carpeta 'browser'
app.use(express.static(browserPath));

// Fallback: para cualquier ruta que no encuentre un archivo estático, sirve el index.html principal
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: browserPath });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
