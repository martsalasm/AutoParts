import express from "express";
const app = express();
app.use(express.json());
import userRouter from "./routes/rutaUsuarios.js";
import productRouter from "./routes/rutaProductos.js";

app.use("/productos", productRouter);
app.use("/usuarios", userRouter);

app.listen(3000);
