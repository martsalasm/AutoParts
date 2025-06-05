document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rut = e.target.rut.value;
    const password = e.target.password.value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rut, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error en el login");
            return;
        }

        // Guardamos los datos en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("tipo", data.tipo);
        localStorage.setItem("rol", data.rol || "");
        localStorage.setItem("nombre", data.nombre);
        localStorage.setItem("apellido", data.apellido);

        // Redirigir según el tipo
        if (data.tipo === "empleado" && data.rol === "admin") {
            window.location.href = window.location.href = "admin/admin-panel.html"; //
        }
        if (data.tipo === "cliente" && data.rol === "b2b") {
            window.location.href = "user-panel.html"; // Panel de usuario
        }

    } catch (err) {
        alert("Error de red al intentar iniciar sesión");
        console.error(err);
    }
});
