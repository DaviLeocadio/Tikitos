import { listarCategorias } from "../models/Categorias.js";
import { listarProdutos } from "../models/Produto.js";

const listarCategoriasController = async (req, res) => {
  try {
    const categorias = listarCategorias();

    res.status(200).json({ mensagem: 'Categoria listada', categorias });
  } catch (err) {
    console.error('Erro ao listar categorias', err);
    res.status(500).json({ err: 'Erro ao listar categoias' })
  }
};

const obterCategoriaPorProdutoController = async (req, res) => {
  try {
    const { idProduto } = req.params;

    const produtos = await listarProdutos();
    const categorias = await listarCategorias();


    const produtosListados = produtos.find((p) => p.id_produto == idProduto);

    if (!produtosListados) return res.status(404).json({ mensagem: 'Produto não encontrado' });

    const categoriaProduto = categorias.find((c) => c.id_categoria == produtosListados.id_categoria)

    if (!categoriaProduto) return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    return res.status(200).json({ mensagem: 'Categoria listada', categoriaProduto });
  } catch (err) {
    console.error('Erro ao listar categorias', err);
    res.status(500).json({ err: 'Erro ao listar categoias' })
  }
}

export { listarCategoriasController, obterCategoriaPorProdutoController }