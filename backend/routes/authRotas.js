import express from "express";
import {
  checkEmailController,
  definirSenhaController,
  loginController,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/checar_email", checkEmailController);

router.post("/definir_senha", definirSenhaController);

router.post("/login", loginController);

router.options("/login", (req, res) => {
  res.setHeader("Allow", "POST, OPTIONS");
  res.status(204).send();
});

export default router;
