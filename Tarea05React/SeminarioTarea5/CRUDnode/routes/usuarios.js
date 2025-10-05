const express = require('express');
const router = express.Router();

// Importar el modelo Usuario centralizado
const Usuario = require('../models/usuario');

// Obtener todos los usuarios (sin password)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'correo']
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, correo, password } = req.body;
    try {
        const nuevoUsuario = await Usuario.create({ nombre, correo, password });
        res.json({ mensaje: 'Usuario creado', usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo } });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        usuario.nombre = nombre;
        usuario.correo = correo;
        // Solo actualiza la contraseña si se envía
        if (password) usuario.password = password;
        await usuario.save();
        res.json({ mensaje: 'Usuario actualizado' });
    } catch (error) {
        console.error(error); // <-- Esto muestra el error en la terminal
        res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
    }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await usuario.destroy();
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        console.error(error); // <-- Esto muestra el error en la terminal
        res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
    }
});

module.exports = router;