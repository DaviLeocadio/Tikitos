// import {
// deleteRecord,
// read,
// readAll,
// update,
// create,
// } from "../config/database.js";

// const listarRelatorios = async (whereClause = null) => {
// try {
//     return await readAll("relatorios", whereClause);
// } catch (err) {
//     console.error("Erro ao listar relatórios: ", err);
//     throw err;
// }
// };

// const obterRelatorioPorId = async (id) => {
// try {
//     return await read("relatorios", `id_relatorio = ${id}`);
// } catch (err) {
//     console.error("Erro ao obter relatório por ID: ", err);
//     throw err;
// }
// };

// const criarRelatorio = async (relatorioData) => {
// try {
//     return await create("relatorios", relatorioData);
// } catch (err) {
//     console.error("Erro ao criar relatório: ", err);
//     throw err;
// }
// };

// const atualizarRelatorio = async (id, relatorioData) => {
// try {
//     await update("relatorios", relatorioData, `id_relatorio = ${id}`);
// } catch (err) {
//     console.error("Erro ao atualizar relatório: ", err);
//     throw err;
// }
// };

// const deletarRelatorio = async (id) => {
// try {
//     return await deleteRecord("relatorios", `id_relatorio = ${id}`);
// } catch (err) {
//     console.error("Erro ao deletar relatório: ", err);
//     throw err;
// }
// };

// export {
// listarRelatorios,
// obterRelatorioPorId,
// criarRelatorio,
// atualizarRelatorio,
// deletarRelatorio,
// };