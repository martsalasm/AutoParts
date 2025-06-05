import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());


import empleadoRouter from "./routes/rutaEmpleados.js";
import loginRouter from "./routes/rutaLogin.js";
import productRouter from "./routes/rutaProductos.js";
import categoriaRouter from "./routes/rutaCategorias.js";
import chilExpressRouter from "./routes/rutaChilExpress.js";
import webpayRouter from "./routes/rutaWebpay.js";
import clienteRouter from "./routes/rutaClientes.js";

app.use("/productos", productRouter);
app.use("/login", loginRouter);
app.use("/categorias", categoriaRouter);
app.use("/empleados", empleadoRouter);
app.use("/clientes", clienteRouter);
app.use("/chilexpress", chilExpressRouter);
app.use("/webpay", webpayRouter);
app.use(express.urlencoded({ extended: true }));
app.listen(3000);
