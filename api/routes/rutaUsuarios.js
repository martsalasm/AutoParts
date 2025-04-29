import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User List");
});

router.get("/new", (req, res) => {
  res.send("Create User");
});

router.post("/", (req, res) => {
  res.send("User Created");
});

router.get("/:rut", (req, res) => {
  res.send(`User with ID: ${req.params.rut}`);
});

export default router;