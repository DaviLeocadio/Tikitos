import {
listarVendendores,
obterVendendorPorId,
criarVendendor,
atualizarVendendor,
excluirVendendor,
} from '../models/Vendendor.js';


const listarVendendoresController = async (req, res) => {
try {
    const vendendores = await listarVendendores();
    res.status(200).json(vendendores);
} catch (err) {
    console.error('Erro ao listar vendendores:', err);
    res.status(500).json({ mensagem: 'Erro ao listar vendendores' });
}
};

const obterVendendorPorIdController = async (req, res) => {
try {
    const vendendor = await obterVendendorPorId(req.params.id);
    if (vendendor) {
        res.json(vendendor);
    } else {
        res.status(404).json({ mensagem: 'Vendendor não encontrado' });
    }
} catch (err) {
    console.error('Erro ao obter vendendor por ID:', err);
    res.status(500).json({ mensagem: 'Erro ao obter vendendor por ID' });
}
};

const criarVendendorController = async (req, res) => {
try {
    const { nome, email, telefone, endereco } = req.body;
    const vendendorData = {
        nome,
        email,
        telefone,
        endereco,
       
    };
    const vendendorId = await criarVendendor(vendendorData);
    res.status(201).json({ mensagem: 'Vendendor criado com sucesso', vendendorId });
} catch (error) {
    console.error('Erro ao criar vendendor:', error);
    res.status(500).json({ mensagem: 'Erro ao criar vendendor' });
}
};

const atualizarVendendorController = async (req, res) => {
try {
    const vendendorId = req.params.id;
    const { nome, email, telefone, endereco } = req.body;
    const vendendorData = {
        nome,
        email,
        telefone,
        endereco,
        foto: fotoPath,
    };
    await atualizarVendendor(vendendorId, vendendorData);
    res.status(200).json({ mensagem: 'Vendendor atualizado com sucesso' });
} catch (error) {
    console.error('Erro ao atualizar vendendor:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar vendendor' });
}
};

const excluirVendendorController = async (req, res) => {
try {
    const vendendorId = req.params.id;
    await excluirVendendor(vendendorId);
    res.status(200).json({ mensagem: 'Vendendor excluído com sucesso' });
} catch (err) {
    console.error('Erro ao excluir vendendor:', err);
    res.status(500).json({ mensagem: 'Erro ao excluir vendendor' });
}
};

export {
listarVendendoresController,
obterVendendorPorIdController,
criarVendendorController,
atualizarVendendorController,
excluirVendendorController,
};