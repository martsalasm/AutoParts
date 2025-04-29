import express from "express";
const app = express();

import userRouter from "./routes/users.js";
import productRouter from "./routes/products.js";

app.use("/products", productRouter);
app.use("/users", userRouter);

app.listen(3000);
