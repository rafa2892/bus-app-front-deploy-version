//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(path.join(__dirname, 'dist', 'gestion-contador-frontend-no-standalone')));

// Handle all routes by sending the index.html file
app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: path.join(__dirname, 'dist', 'gestion-contador-frontend-no-standalone')}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
