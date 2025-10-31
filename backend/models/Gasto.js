import {
deleteRecord,
read,
readAll,
update,
create,
} from "../config/database.js";

const listarGastos = async () => {
try {
    return await readAll("gastos");
} catch (err) {
    console.error("Erro ao listar gastos: ", err);
    throw err;
}
};

const obterGastoPorId = async (gastoId) => {
try {
    return await read("gastos", `id_gasto = ${gastoId}`);
} catch (err) {
    console.error("Erro ao obter detalhes do gasto: ", err);
    throw err;
}
};

const obterGastoPorData = async (dataCaixa, idCaixa, idEmpresa) => {
try {
    return await readAll(
        "gastos",
        `DATE(data_gasto) = '${dataCaixa}' AND id_caixa = ${idCaixa} AND id_empresa = ${idEmpresa}`
    );
} catch (err) {
    console.error("Erro ao obter gastos por data: ", err);
    throw err;
}
};

const criarGasto = async (gastoData) => {
try {
    return await create("gastos", gastoData);
} catch (err) {
    console.error("Erro ao registrar gasto: ", err);
    throw err;
}
};

const atualizarGasto = async (gastoId, gastoData) => {
try {
    await update("gastos", gastoData, `id_gasto = ${gastoId}`);
} catch (err) {
    console.error("Erro ao atualizar gasto: ", err);
    throw err;
}
};

const excluirGasto = async (gastoId) => {
try {
    await deleteRecord("gastos", `id_gasto = ${gastoId}`);
} catch (err) {
    console.error("Erro ao excluir gasto", err);
    throw err;
}
};

export {
listarGastos,
obterGastoPorId,
obterGastoPorData,
criarGasto,
atualizarGasto,
excluirGasto,
};