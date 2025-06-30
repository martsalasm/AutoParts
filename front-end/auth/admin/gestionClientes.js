import { showModal } from "../../modal.js";
const API_URL = "http://localhost:3000/clientes";

document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  
  window.eliminarCliente = async (rut) => {
    if (!confirm("¿Deseas eliminar este cliente?")) return;
    try {
      const res = await fetch(`${API_URL}/${rut}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cliente");
      cargarClientes();
    } catch (err) {
      console.error(err);
      console.log("No se pudo eliminar el cliente.");
      showModal('Error', 'No se pudo eliminar el cliente', 'error');
    }
  };

  document.getElementById("form-cliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoCliente = {
      rutCliente: document.getElementById("rut").value.trim(),
      nombreCliente: document.getElementById("nombre").value.trim(),
      apellidoCliente: document.getElementById("apellido").value.trim(),
      tipoCliente: document.getElementById("tipo").value.trim(),
      telefonoCliente: document.getElementById("telefono").value.trim(),
      correoCliente: document.getElementById("correo").value.trim(),
      contrasena: document.getElementById("contrasena").value.trim(),
    };

    if (Object.values(nuevoCliente).some((val) => !val)) {
      return console.log("Todos los campos son obligatorios");
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });

      if (!res.ok) {
        const error = await res.json();
        showModal('Error', 'No se pudo agregar el cliente', 'error');
        return console.log("Error: " + (error.error || "No se pudo agregar el cliente"));
      }

      document.getElementById("form-cliente").reset();
      showModal('Éxito', 'Cliente agregado exitosamente', 'success');
      cargarClientes();
    } catch (err) {
      console.error(err);
      showModal('Error', 'No se pudo agregar el cliente', 'error');
      console.log("Error de red al intentar agregar cliente");
    }
  });
});

async function cargarClientes() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<p>Cargando clientes...</p>";

  try {
    const res = await fetch(API_URL);
    const clientes = await res.json();

    container.innerHTML = "";

    if (!clientes.length) {
      container.innerHTML = "<p>No hay clientes registrados.</p>";
      return;
    }

    clientes.forEach((cli) => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
        <h3>${cli.nombre_cliente} ${cli.apellido_cliente}</h3>
        <p><strong>RUT:</strong> ${cli.rut_cliente}</p>
        <p><strong>Tipo:</strong> ${cli.tipo_cliente}</p> <!-- cambia “Rol” si prefieres “Tipo” -->
        <p><strong>Tel:</strong> ${cli.telefono_cliente}</p>
        <p><strong>Correo:</strong> ${cli.correo_cliente}</p>
        <button onclick="eliminarCliente('${cli.rut_cliente}')">Eliminar</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error al cargar clientes.</p>";
  }
}
