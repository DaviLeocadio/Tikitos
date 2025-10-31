import {
    listarEmpresas,
    obterEmpresaPorId,
    criarEmpresa,
    atualizarEmpresa
} from "../models/Empresa.js";



const listarEmpresasController = async (req, res) => {
    try {
        const empresas = await listarEmpresas();

        if (empresas.length == 0) return res.status(404).json({ error: 'Nenhuma empresa encontrada' });

        return res.status(200).json({ empresas });
    } catch (error) {
        console.error("Erro ao listar empresas: ", error);
        res.status(500).json({ error: "Erro ao listar empresas" });
    }
}

const obterEmpresaPorIdController = async (req, res) => {
    try {
        const empresaId = req.params.id;

        const empresa = await obterEmpresaPorId(empresaId);

        if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });

        return res.status(200).json({ empresa })
    } catch (error) {
        console.error("Erro ao obter empresa por ID: ", error);
        res.status(500).json({ error: "Erro ao obter empresa por ID" });
    }
}

const criarEmpresaController = async (req, res) => {
    try {
        const { nome, endereco } = req.body;

        if (!nome || !endereco) return res.status(404).json({ error: 'Parâmetros obrigatórios ausentes' });

        const empresaData = {
            nome: nome,
            tipo: 'filial',
            endereco: endereco
        }

        const empresaId = await criarEmpresa(empresaData);

        return res.status(201).json({ mensagem: 'Empresa criada com sucesso', empresaId })

    } catch (error) {
        console.error("Erro ao criar empresa: ", error);
        res.status(500).json({ error: "Erro ao criar empresa" });
    }
}

const atualizarEmpresaController = async (req, res) => {
    try {
        const empresaId = req.params.id;

        const { nome, endereco, status } = req.body;

        if (!nome || !endereco || !status) return res.status(404).json({ error: 'Parâmetros obrigatórios ausentes' });

        const empresaData = {
            nome: nome,
            endereco: endereco,
            status: status
        }

        const empresaAtualizada = await atualizarEmpresa(empresaId, empresaData);

        return res.status(201).json({ mensagem: 'Empresa atualizada com sucesso', empresaAtualizada })

    } catch (error) {
        console.error("Erro ao atualizar empresa: ", error);
        res.status(500).json({ error: "Erro ao atualizar empresa" });
    }
}

export { listarEmpresasController, obterEmpresaPorIdController, criarEmpresaController, atualizarEmpresaController }