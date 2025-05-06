// JavaScript
let carrito = [];
let productos = [];

function mostrarSeccion(seccion) {
  document.getElementById("seccion-catalogo").style.display = seccion === 'catalogo' ? 'block' : 'none';
  document.getElementById("seccion-ofertas").style.display = seccion === 'ofertas' ? 'block' : 'none';
  document.getElementById("seccion-contacto").style.display = seccion === 'contacto' ? 'block' : 'none';
  document.getElementById("agregar-form").style.display = 'none';
  document.getElementById("login-form").style.display = 'none';
}

function mostrarLogin() {
  document.getElementById("login-form").style.display = 'block';
  document.getElementById("agregar-form").style.display = 'none';
}

function iniciarSesion() {
  const pass = document.getElementById("contrasena").value;
  if (pass === "admin123") {
    document.getElementById("login-form").style.display = 'none';
    document.getElementById("agregar-form").style.display = 'block';
    document.getElementById("contrasena").value = "";
  } else {
    alert("Contraseña incorrecta");
    document.getElementById("contrasena").value = "";
  }
}

function agregarProducto() {
  const categoria = document.getElementById("categoria").value;
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const imagen = document.getElementById("imagen").value;

  if (!nombre || !descripcion || !precio || !imagen) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const producto = { categoria, nombre, descripcion, precio, imagen };
  productos.push(producto);
  guardarProductos();
  renderizarProductos();
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("imagen").value = "";
}

function filtrarCategoria(categoria) {
  renderizarProductos(productos.filter(p => p.categoria === categoria || categoria === ""));
}

function renderizarProductos(lista = productos) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";
  lista.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p><strong>₡${prod.precio.toFixed(2)}</strong></p>
      <a href="#" onclick="comprarPorWhatsApp('${prod.nombre}', ${prod.precio}, this)">
        <button>Comprar por WhatsApp</button>
      </a>
    `;
    contenedor.appendChild(div);
  });
}

function comprarPorWhatsApp(nombre, precio, elemento) {
  const cantidad = 1;
  const moneda = "₡";
  const item = { nombre, precio, cantidad, moneda };
  carrito.push(item);
  actualizarCarrito();
}

function confirmarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero hacer una compra:\n\n";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `${item.nombre} - ${item.moneda}${item.precio} x ${item.cantidad} = ${item.moneda}${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });

  mensaje += `\nTotal: CRC${total.toFixed(2)}\n`;
  mensaje += "Por favor, indícame cómo completar el pago.";

  const numeroWhatsApp = "50687092702";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");
    li.textContent = `${item.nombre} - ${item.moneda}${item.precio} x ${item.cantidad} = ${item.moneda}${subtotal.toFixed(2)}`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = total.toFixed(2);
}

function guardarProductos() {
  localStorage.setItem("productosBisey", JSON.stringify(productos));
}

function cargarProductos() {
  const data = localStorage.getItem("productosBisey");
  if (data) {
    productos = JSON.parse(data);
    renderizarProductos(productos);
  }
}

// Cargar productos al iniciar
window.onload = () => {
  cargarProductos();
};