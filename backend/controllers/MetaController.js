import { listarCategorias } from "../models/Categorias.js";

const metaController = async (req, res) => {
    try {
        const query = req.query;

        if(query.includes('categorias')) {

            const categorias = await listarCategorias();

            return res.status(200).json({categorias});
        }
    } catch (error) {
        console.error("Erro ao obter dados: ", error);
        res.status(500).json({ error: "Erro ao obter dados" });
    }
};

export { metaController }