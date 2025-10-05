function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = tipo;
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000);
}

function mostrarUsuarios(usuarios) {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = '';
    if (usuarios.length === 0) {
        lista.innerHTML = '<li>No hay usuarios registrados.</li>';
        return;
    }
    usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="usuario-card">
                <span class="usuario-nombre"><strong>Nombre:</strong> ${usuario.nombre}</span><br>
                <span class="usuario-correo"><strong>Correo:</strong> ${usuario.correo}</span><br>
                <button class="editar-btn" data-id="${usuario.id}">Editar</button>
                <button class="eliminar-btn" data-id="${usuario.id}">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });

    // Eventos para eliminar
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.mensaje) {
                            mostrarMensaje(data.mensaje, 'exito');
                            obtenerUsuarios();
                        } else {
                            mostrarMensaje(data.error || 'Error al eliminar', 'error');
                        }
                    })
                    .catch(() => mostrarMensaje('Error de conexión al eliminar', 'error'));
            }
        };
    });

    // Eventos para editar
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.onclick = function() {
            const id = this.getAttribute('data-id');
            const usuario = usuarios.find(u => u.id == id);
            if (usuario) {
                document.getElementById('nombre').value = usuario.nombre;
                document.getElementById('correo').value = usuario.correo;
                document.getElementById('password').value = '';
                document.getElementById('form-usuario').setAttribute('data-editar', id);
                document.getElementById('form-usuario').querySelector('button[type="submit"]').textContent = 'Actualizar';
            }
        };
    });
}

function obtenerUsuarios() {
    fetch('/api/usuarios')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                mostrarUsuarios(data);
            } else {
                mostrarMensaje('Error al obtener usuarios', 'error');
            }
        })
        .catch(() => mostrarMensaje('Error de conexión al obtener usuarios', 'error'));
}

obtenerUsuarios();

document.getElementById('form-usuario').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const idEditar = this.getAttribute('data-editar');

    if (!nombre || !correo || (!password && !idEditar)) {
        mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    if (idEditar) {
        // Actualizar usuario
        fetch(`/api/usuarios/${idEditar}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje) {
                mostrarMensaje(data.mensaje, 'exito');
                this.reset();
                this.removeAttribute('data-editar');
                this.querySelector('button[type="submit"]').textContent = 'Crear';
                obtenerUsuarios();
            } else if (data.error) {
                mostrarMensaje(data.error, 'error');
            }
        })
        .catch(() => mostrarMensaje('Error de conexión al actualizar', 'error'));
    } else {
        // Crear usuario
        fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje) {
                mostrarMensaje(data.mensaje, 'exito');
                this.reset();
                obtenerUsuarios();
            } else if (data.error) {
                mostrarMensaje(data.error, 'error');
            }
        })
        .catch(() => mostrarMensaje('Error de conexión al crear usuario', 'error'));
    }
});