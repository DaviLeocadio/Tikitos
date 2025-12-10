import {
  deleteRecord,
  read,
  readAll,
  update,
  create,
  readRaw,
} from "../config/database.js";

const listarEmpresas = async (whereClause = null) => {
  try {
    if (whereClause) {
      whereClause += ` AND status = 'ativo'`;
    } else {
      whereClause = `status = 'ativo'`;
    }
    return await readAll("empresas", whereClause);
  } catch (err) {
    console.error("Erro ao listar empresas: ", err);
    throw err;
  }
};

const listarTodasEmpresas = async (whereClause = null) => {
  try {
    return await readAll("empresas", whereClause);
  } catch (err) {
    console.error("Erro ao listar empresas: ", err);
    throw err;
  }
};

const obterEmpresaPorId = async (empresaId) => {
  try {
    return await read("empresas", `id_empresa = ${empresaId}`);
  } catch (err) {
    console.error("Erro ao obter empresa por ID: ", err);
    throw err;
  }
};

const criarEmpresa = async (empresaData) => {
  try {
    return await create("empresas", empresaData);
  } catch (err) {
    console.error("Erro ao criar empresa: ", err);
    throw err;
  }
};

const atualizarEmpresa = async (empresaId, empresaData) => {
  try {
    return await update("empresas", empresaData, `id_empresa = ${empresaId}`);
  } catch (err) {
    console.error("Erro ao atualizar empresa: ", err);
    throw err;
  }
};

const listarEmpresasSemGerente = async () => {
  try {
    return await readRaw(` 
   SELECT
    e.id_empresa,
    e.nome,
    e.tipo,
    e.status
FROM empresas e
LEFT JOIN usuarios u
    ON u.id_empresa = e.id_empresa
    AND u.perfil = 'gerente'
    AND u.status = 'ativo'    
WHERE u.id_usuario IS NULL      
  AND e.status = 'ativo'
  AND e.tipo = 'filial';
`);
  } catch (err) {
    console.error("Erro ao atualizar empresa: ", err);
    throw err;
  }
};

export {
  listarEmpresas,
  obterEmpresaPorId,
  criarEmpresa,
  atualizarEmpresa,
  listarTodasEmpresas,
  listarEmpresasSemGerente,
};
