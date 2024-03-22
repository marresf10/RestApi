import express from "express";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getCredentials, getToken } from "./utils/header.js";
import {
  signToken,
  verifyToken,
  validateExpiration,
} from "./utils/token.js";

dotenv.config();
app.listen(3000);


//Conexión a mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectando a la base de datos Atlas"))
  .catch((error) => console.error(error));

console.log("Servidor escuchando en el puerto:", 3000);


//Obtener el token
app.post("/token", (req, res) => {
    try {
      const { username, password } = getCredentials(req);
      const user = getUser(username, password);
      const token = signToken(user);
      res.send({ token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  