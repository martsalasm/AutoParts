import express from "express";
const app = express();

import userRouter from "./routes/rutaUsuarios.js";
import productRouter from "./routes/rutaProductos.js";

app.use("/products", productRouter);
app.use("/users", userRouter);

app.listen(3000);
