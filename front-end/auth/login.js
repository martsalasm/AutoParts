document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const rut = formData.get("rut");
  const password = formData.get("password");

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      if (data.tipo === "empleado") {
        window.location.href = "/panel-empleado.html";
      } else {
        window.location.href = "/cliente-dashboard.html";
      }
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  } catch (err) {
    console.error(err);
    alert("Error en la conexión");
  }
});