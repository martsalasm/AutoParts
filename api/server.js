import express from "express";
const app = express();
app.use(express.json());
import empleadoRouter from "./routes/rutaEmpleados.js";
import productRouter from "./routes/rutaProductos.js";

app.use("/productos", productRouter);
app.use("/empleados", empleadoRouter);

app.listen(3000);
