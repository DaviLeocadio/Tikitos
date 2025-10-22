// import { 
// listarRelatorios,
// obterRelatorioPorId,
// criarRelatorio,
// atualizarRelatorio,
// excluirRelatorio,
// } from '../models/Relatorio.js';
// import { fileURLToPath } from 'url';
// import path from 'path';



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const listarRelatoriosController = async (req, res) => {
// try {
//     const relatorios = await listarRelatorios();
//     res.status(200).json(relatorios);
// } catch (err) {
//     console.error('Erro ao listar relatórios: ', err);
//     res.status(500).json({ mensagem: 'Erro ao listar relatórios' });
// }
// };

// const obterRelatorioPorIdController = async (req, res) => {
// try {
//     const relatorio = await obterRelatorioPorId(req.params.id);
//     if (relatorio) {
//         res.json(relatorio);
//     } else {
//         res.status(404).json({ mensagem: 'Relatório não encontrado' });
//     }
// } catch (err) {
//     console.error('Erro ao obter relatório por ID: ', err);
//     res.status(500).json({ mensagem: 'Erro ao obter relatório por ID' });
// }
// };

// const criarRelatorioController = async (req, res) => {
// try {
//     const { titulo, descricao, data } = req.body;
//     const relatorioData = {
//         titulo,
//         descricao,
//         data,
//     };
//     const relatorioId = await criarRelatorio(relatorioData);
//     res.status(201).json({ mensagem: 'Relatório criado com sucesso', relatorioId });
// } catch (error) {
//     console.error('Erro ao criar relatório:', error);
//     res.status(500).json({ mensagem: 'Erro ao criar relatório' });
// }
// };

// const atualizarRelatorioController = async (req, res) => {
// try {
//     const relatorioId = req.params.id;
//     const { titulo, descricao, data } = req.body;
//     const relatorioData = {
//         titulo,
//         descricao,
//         data,
//     };
//     await atualizarRelatorio(relatorioId, relatorioData);
//     res.status(200).json({ mensagem: 'Relatório atualizado com sucesso' });
// } catch (error) {
//     console.error('Erro ao atualizar relatório:', error);
//     res.status(500).json({ mensagem: 'Erro ao atualizar relatório' });
// }
// };

// const excluirRelatorioController = async (req, res) => {
// try {
//     const relatorioId = req.params.id;
//     await excluirRelatorio(relatorioId);
//     res.status(200).json({ mensagem: 'Relatório excluído com sucesso' });
// } catch (err) {
//     console.error('Erro ao excluir relatório:', err);
//     res.status(500).json({ mensagem: 'Erro ao excluir relatório' });
// }
// };

// export {
// obterRelatorioPorIdController,
// listarRelatoriosController,
// excluirRelatorioController,
// atualizarRelatorioController,
// criarRelatorioController,
// };