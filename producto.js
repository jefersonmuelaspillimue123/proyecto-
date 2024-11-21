// Array de productos de ejemplo
const productos = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    precio: (i + 1) * 10,
    imagen: "./tenis.jpg"
}));

// Carrito de compras
let carrito = [];
const productosContainer = document.getElementById("productos-container");

// Función para renderizar productos
function renderProductos() {
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-md-6 col-lg-4 col-xl-3 mb-4"; // Ajuste en clases para mejorar el diseño
        colDiv.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <input type="number" min="1" value="1" class="form-control mb-2 product-quantity" data-id="${producto.id}">
                    <button class="btn btn-primary w-100" data-id="${producto.id}">Agregar al Carrito</button>
                </div>
            </div>
        `;
        fragment.appendChild(colDiv);
    });
    productosContainer.appendChild(fragment);
}

// Manejar eventos de producto (Agregar al carrito)
productosContainer.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
        const productoId = parseInt(e.target.dataset.id);
        const quantityInput = document.querySelector(`.product-quantity[data-id='${productoId}']`);
        const cantidad = parseInt(quantityInput.value);
        if (cantidad > 0) {
            agregarAlCarrito(productoId, cantidad);
        } else {
            alert("Por favor, ingresa una cantidad válida.");
        }
    }
});

// Función para agregar producto al carrito
function agregarAlCarrito(productoId, cantidad) {
    const producto = productos.find(p => p.id === productoId);
    const productoEnCarrito = carrito.find(p => p.id === productoId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad });
    }
    actualizarCarrito();
}

// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    carritoContainer.innerHTML = carrito.map(producto =>
        `<div class="carrito-item d-flex justify-content-between align-items-center mb-2">
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <div>
                <button onclick="cambiarCantidad(${producto.id}, -1)" class="btn btn-sm btn-secondary">-</button>
                <span>${producto.cantidad}</span>
                <button onclick="cambiarCantidad(${producto.id}, 1)" class="btn btn-sm btn-secondary">+</button>
                <button onclick="eliminarDelCarrito(${producto.id})" class="btn btn-danger btn-sm">Eliminar</button>
            </div>
        </div>`
    ).join("");

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById("carrito-total").innerText = `Total: $${total}`;
}

// Cambiar la cantidad de un producto en el carrito
function cambiarCantidad(productoId, cambio) {
    const producto = carrito.find(p => p.id === productoId);
    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            actualizarCarrito();
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(producto => producto.id !== productoId);
    actualizarCarrito();
}

// Finalizar compra: cerrar el modal del carrito y abrir el de finalización
function finalizarCompra() {
    const carritoModal = bootstrap.Modal.getInstance(document.getElementById("carritoModal"));
    carritoModal.hide();
    const finalizacionModal = new bootstrap.Modal(document.getElementById("finalizacionModal"));
    finalizacionModal.show();
}

// Completar el pedido
function completarPedido() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;

    if (!nombre || !email || !direccion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    alert(`¡Gracias por tu compra, ${nombre}! Te enviaremos un correo de confirmación a ${email}.`);
    carrito = [];
    actualizarCarrito();
    document.getElementById("form-finalizacion").reset();
    const finalizacionModal = bootstrap.Modal.getInstance(document.getElementById("finalizacionModal"));
    finalizacionModal.hide();
}

// Renderizar productos al cargar la página
renderProductos();

