
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json()); // en versiones recientes reemplaza body-parser

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsDB';
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch((err) => {
  console.error('Error conectando a MongoDB:', err.message);
  process.exit(1);
});

// Rutas
app.use('/api/contacts', contactRoutes);

// Middleware errores
app.use(errorHandler);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`API REST corriendo en http://localhost:${PORT}`);
});
