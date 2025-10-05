const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/productos', productosController.listarProductos);
router.post('/productos', upload.single('imagen'), productosController.crearProducto);
router.get('/productos/:id', productosController.obtenerProductoPorId);
router.put('/productos/:id', upload.none(), productosController.actualizarProducto);
router.delete('/productos/:id', productosController.eliminarProducto);

module.exports = router;
