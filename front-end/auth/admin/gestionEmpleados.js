import { showModal } from "../../modal.js";
const API_URL = "http://localhost:3000/empleados";

document.addEventListener("DOMContentLoaded", () => {
  cargarEmpleados();
  window.eliminarEmpleado = async (rut) => {
    if (!confirm("¿Deseas eliminar este empleado?")) return;
    try {
      const res = await fetch(`${API_URL}/${rut}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      showModal('Éxito', 'Empleado eliminado exitosamente', 'success');
      cargarEmpleados();
    } catch (err) {
      console.error(err);
      console.log("No se pudo eliminar el empleado.");
      showModal('Error', 'No se pudo eliminar el empleado', 'error');
    }
  };

  document
    .getElementById("form-empleado")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const nuevoEmpleado = {
        rutEmpleado: document.getElementById("rut").value.trim(),
        nombreEmpleado: document.getElementById("nombre").value.trim(),
        apellidoEmpleado: document.getElementById("apellido").value.trim(),
        rolEmpleado: document.getElementById("rol").value.trim(),
        telefonoEmpleado: document.getElementById("telefono").value.trim(),
        correoEmpleado: document.getElementById("correo").value.trim(),
        contrasenaEmpleado: document.getElementById("contrasena").value.trim(),
      };

      if (Object.values(nuevoEmpleado).some((val) => !val)) {
        return console.log("Todos los campos son obligatorios");
      }

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEmpleado),
        });

        if (!res.ok) {
          const error = await res.json();
          showModal('Error', 'No se pudo agregar el empleado', 'error');
          return console.log(
            "Error: " + (error.error || "No se pudo agregar el empleado")
          );
        }

        document.getElementById("form-empleado").reset();
        cargarEmpleados();
        showModal('Éxito', 'Empleado agregado exitosamente', 'success');
      } catch (err) {
        console.error(err);
        showModal('Error', 'No se pudo agregar el empleado', 'error');
        console.log("Error de red al intentar agregar empleado");
      }
    });
});

async function cargarEmpleados() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<p>Cargando empleados...</p>";

  try {
    const res = await fetch(API_URL);
    const empleados = await res.json();

    container.innerHTML = "";

    if (!empleados.length) {
      container.innerHTML = "<p>No hay empleados registrados.</p>";
      return;
    }

    empleados.forEach((emp) => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
                    <h3>${emp.nombre_empleado} ${emp.apellido_empleado}</h3>
                    <p><strong>RUT:</strong> ${emp.rut_empleado}</p>
                    <p><strong>Rol:</strong> ${emp.rol_empleado}</p>
                    <p><strong>Tel:</strong> ${emp.telefono_empleado}</p>
                    <p><strong>Correo:</strong> ${emp.correo_empleado}</p>
                    <button onclick="eliminarEmpleado('${emp.rut_empleado}')">Eliminar</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error al cargar empleados.</p>";
  }
}
