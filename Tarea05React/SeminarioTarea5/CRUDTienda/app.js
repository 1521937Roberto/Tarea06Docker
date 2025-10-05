const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const productosRoutes = require('./routes/productos');
app.use('/api', productosRoutes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
 console.log(`Servidor ejecutándose en http://localhost:${port}`);
});