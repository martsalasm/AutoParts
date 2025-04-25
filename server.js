const express = require("express");
const app = express();

const userRouter = require("./routes/users");
const productRouter = require("./routes/products");

app.use("/products", productRouter);
app.use("/users", userRouter);

app.listen(3000);
