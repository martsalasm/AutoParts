import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
import empleadoRouter from "./routes/rutaEmpleados.js";
import productRouter from "./routes/rutaProductos.js";
import chilExpressRouter from "./routes/rutaChilExpress.js";
import webpayRouter from "./routes/rutaWebpay.js";

app.use("/productos", productRouter);
app.use("/empleados", empleadoRouter);
app.use("/chilexpress", chilExpressRouter);
app.use("/webpay", webpayRouter);

app.listen(3000);
