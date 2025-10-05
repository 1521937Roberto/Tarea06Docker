const express = require('express');
const cors = require('cors');
const sequelize = require('./bd');
const usuariosRouter = require('./routes/usuarios');

const app = express();
app.use(cors());
app.use(express.json());

//Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));
app.use('/api/usuarios', usuariosRouter);

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Servidor escuchando en http://localhost:3000');
    }
    );
}).catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
});