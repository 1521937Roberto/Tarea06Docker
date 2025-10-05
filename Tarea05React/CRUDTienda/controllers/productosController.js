const connection = require('../config/bd.js');

//CREACION DE PRODUCTO
exports.crearProducto = (req, res) => {
    const producto = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        stock: req.body.stock,
        imagen: req.file ? req.file.filename : ''
    };
    const query = "INSERT INTO productos SET ?";
    connection.query(query, producto, (err, result) => {
        if (err) throw err;
        res.send('Producto creado exitosamente');
    });
};

//LECTURA DE PRODUCTOS
exports.listarProductos = (req, res) => {
    connection.query("SELECT * FROM productos", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};
exports.obtenerProductoPorId = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM productos WHERE id = ?", [id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
};


//ACTUALIZACION DE PRODUCTO

exports.actualizarProducto = (req, res) => {
    const id = req.params.id;
    const productoActualizado = {
        precio: req.body.precio,
        stock: req.body.stock
    };
    connection.query("UPDATE productos SET ? WHERE id = ?", [productoActualizado, id], (err, result) => {
        if (err) throw err;
        res.send('Producto actualizado exitosamente');
    });
};


//ELIMINACION DE PRODUCTO
exports.eliminarProducto = (req, res) => {
 const id = req.params.id;
 connection.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
 if (err) throw err;
 res.send('Producto eliminado exitosamente');
 });
};