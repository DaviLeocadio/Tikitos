import express from "express";
import dotenv from 'dotenv'
import { AbrirCaixaController, FecharCaixaController } from "../controllers/CaixaController.js";

dotenv.config();

const router = express.Router();

router.post("/caixa/:idVendedor", AbrirCaixaController);
router.put("/caixa/:idVendedor", FecharCaixaController);

export default router;