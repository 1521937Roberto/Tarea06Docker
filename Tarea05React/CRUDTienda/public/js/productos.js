// public/js/productos.js

// Mostrar productos
function cargarProductos() {
  fetch('/api/productos')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById('productos');
      contenedor.innerHTML = '';
      data.forEach(prod => {
        contenedor.innerHTML += `
          <tr>
            <td>${prod.nombre}</td>
            <td>S/ ${prod.precio}</td>
            <td>${prod.stock}</td>
            <td><img src="/uploads/${prod.imagen}" alt="${prod.nombre}" style="height:32px;width:32px;object-fit:contain;"></td>
            <td>
              <button class="btn btn-primary btn-sm btn-editar" data-id="${prod.id}">Editar</button>
              <button class="btn btn-danger btn-sm btn-eliminar" data-id="${prod.id}">Eliminar</button>
            </td>
          </tr>
        `;
      });
      // Asignar eventos a los botones después de renderizar
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          if (confirm('¿Estás seguro de eliminar este producto?')) {
            fetch(`/api/productos/${id}`, { method: 'DELETE' })
              .then(res => res.text())
              .then(msg => {
                alert(msg);
                cargarProductos();
              });
          }
        });
      });
      document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          fetch(`/api/productos/${id}`)
            .then(res => res.json())
            .then(prod => {
              // Rellenar el formulario modal con los datos del producto
              document.getElementById('nombre').value = prod.nombre;
              document.getElementById('precio').value = prod.precio;
              document.getElementById('stock').value = prod.stock;
              // Guardar el id en un atributo del formulario
              document.getElementById('formProducto').setAttribute('data-id', id);
              // Quitar required al input de imagen al editar
              document.getElementById('imagen').removeAttribute('required');
              // Mostrar el modal (Bootstrap 5)
              var modal = new bootstrap.Modal(document.getElementById('modalCrear'));
              modal.show();
            });
        });
      });
    });
}
cargarProductos();

// Agregar producto


// Al abrir el modal para crear, poner required en imagen y limpiar el form
document.querySelector('[data-bs-target="#modalCrear"]').addEventListener('click', function() {
  document.getElementById('formProducto').reset();
  document.getElementById('formProducto').removeAttribute('data-id');
  document.getElementById('imagen').setAttribute('required', 'required');
});

document.getElementById('formProducto').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const id = this.getAttribute('data-id');
  let url = '/api/productos';
  let method = 'POST';
  if (id) {
    url = `/api/productos/${id}`;
    method = 'PUT';
    this.removeAttribute('data-id');
  }
  fetch(url, {
    method: method,
    body: formData
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    cargarProductos();
    this.reset();
    // Cerrar el modal si está abierto
    if (typeof bootstrap !== 'undefined') {
      var modal = bootstrap.Modal.getInstance(document.getElementById('modalCrear'));
      if (modal) modal.hide();
    }
    // Al terminar, volver a poner required si es para crear
    document.getElementById('imagen').setAttribute('required', 'required');
  });
});
