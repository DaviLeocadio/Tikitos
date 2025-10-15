import {
listarUsuarios,
obterUsuarioPorId,
criarUsuario,
atualizarUsuario,
excluirUsuario,
} from '../models/Usuario.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarUsuariosController = async (req, res) => {
try {
    const usuarios = await listarUsuarios();
    res.status(200).json(usuarios);
} catch (err) {
    console.error('Erro ao listar usuários: ', err);
    res.status(500).json({ mensagem: 'Erro ao listar usuários' });
}
};

const obterUsuarioPorIdController = async (req, res) => {
try {
    const usuario = await obterUsuarioPorId(req.params.id);
    if (usuario) {
        res.json(usuario);
    } else {
        res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
} catch (err) {
    console.error('Erro ao obter usuário por ID: ', err);
    res.status(500).json({ mensagem: 'Erro ao obter usuário por ID' });
}
};

const criarUsuarioController = async (req, res) => {
try {
    const { nome, email, telefone,  cpf, enderoco, data_nasc, senha } = req.body

// ideia de onde salvar a imagem se tiver imagem
    let avatarPath = null;
    if (req.file) {
        avatarPath = req.file.path.replace(
            __dirname.replace('\\controllers', ''),
            ''
        );
    }
    const usuarioData = {
        nome: nome,
        email: email,
        telefone: telefone,
        cpf: cpf,
        enderoco: enderoco,
        data_nasc: data_nasc,
        senha: senha,
        avatar: avatarPath
    };
    const usuarioId = await criarUsuario(usuarioData);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuarioId });
} catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ mensagem: 'Erro ao criar usuário' });
}
};

const atualizarUsuarioController = async (req, res) => {
try {
    const usuarioId = req.params.id;
    const { nome, email, telefone,  cpf, enderoco, data_nasc, senha } = req.body;
    let avatarPath = null;
    if (req.file) {
        avatarPath = req.file.path.replace(
            __dirname.replace('\\controllers', ''),
            ''
        );
    }
    const usuarioData = {
        nome: nome,
        email: email,
        telefone: telefone,
        cpf: cpf,
        enderoco: enderoco,
        data_nasc: data_nasc,
        senha: senha,
        avatar: avatarPath
    };
    await atualizarUsuario(usuarioId, usuarioData);
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
} catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
}
};

const excluirUsuarioController = async (req, res) => {
try {
    const usuarioId = req.params.id;
    await excluirUsuario(usuarioId);
    res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
} catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).json({ mensagem: 'Erro ao excluir usuário' });
}
};

export {
obterUsuarioPorIdController,
listarUsuariosController,
excluirUsuarioController,
atualizarUsuarioController,
criarUsuarioController,
};