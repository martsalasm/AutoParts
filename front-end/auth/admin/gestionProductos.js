import { showModal } from "../../modal.js";
const API_URL = "http://localhost:3000/productos";

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  window.eliminarProducto = async (id) => {
    if (!confirm("¿Deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");
      cargarProductos();
    } catch (err) {
      console.error(err);
      console.log("No se pudo eliminar el producto.");
    }
  };

  document.getElementById("form-producto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre: document.getElementById("nombre").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      precio: parseFloat(document.getElementById("precio").value),
      preciob2b: parseFloat(document.getElementById("preciob2b").value),
      marca: document.getElementById("marca").value.trim(),
      stock: parseInt(document.getElementById("stock").value),
      imagen: document.getElementById("imagen").value.trim(),
      peso: parseFloat(document.getElementById("peso").value),
      alto: parseFloat(document.getElementById("alto").value),
      ancho: parseFloat(document.getElementById("ancho").value),
      largo: parseFloat(document.getElementById("largo").value),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!res.ok) {
        const error = await res.json();
        return console.log("Error: " + (error.error || "No se pudo agregar el producto"));
      }

      document.getElementById("form-producto").reset();
      cargarProductos();
      showModal('Éxito', 'Producto agregado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showModal('Error', 'No se pudo agregar el producto', 'error');
      console.log("Error de red al intentar agregar producto");
    }
  });
});

async function cargarProductos() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch(API_URL);
    const productos = await res.json();

    container.innerHTML = "";

    if (!productos.length) {
      container.innerHTML = "<p>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((prod) => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
        <h3>${prod.nombre_producto}</h3>
        <p><strong>Precio:</strong> $${prod.precio}</p>
        <p><strong>Precio B2B:</strong> $${prod.preciob2b}</p>
        <p><strong>Marca:</strong> ${prod.marca}</p>
        <p><strong>Stock:</strong> ${prod.stock}</p>
        <p><strong>Dimensiones (cm):</strong> ${prod.product_height} x ${prod.product_width} x ${prod.product_length}</p>
        <p><strong>Peso:</strong> ${prod.product_weight} kg</p>
        <img src="${prod.url_imagen}" alt="Imagen del producto" style="width: 100px; height: auto;">
        <button onclick="eliminarProducto(${prod.id_producto})">Eliminar</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error al cargar productos.</p>";
  }
}
