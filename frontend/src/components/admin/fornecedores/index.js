// Arquivo: src/components/admin/fornecedores/index.js

import TableInline from "./TableInline";
import FornecedoresFilters from "./FornecedoresFilters";
import FornecedoresTable from "./FornecedoresTable";
import GetFornecedorColumns from "./GetFornecedorColumns";
import useFornecedores from "./useFornecedores";
import ModalEditarFornecedor from "./ModalEditarFornecedor";

// Objeto agrupado (caso você use import Components from ...)
const Components = {
  // Componentes de Tabela (vindos do TableInline local)
  Table: TableInline?.Table,
  TableHeader: TableInline?.TableHeader,
  TableBody: TableInline?.TableBody,
  TableRow: TableInline?.TableRow,
  TableHead: TableInline?.TableHead,
  TableCell: TableInline?.TableCell,

  // Componentes de Lógica e UI do Fornecedor
  FornecedoresFilters,
  FornecedoresTable,
  GetFornecedorColumns,
  useFornecedores,
  ModalEditarFornecedor,
};

export default Components;

// Exportações Nomeadas (para usar { useFornecedores } from ...)
export { default as FornecedoresFilters } from "./FornecedoresFilters";
export { default as FornecedoresTable } from "./FornecedoresTable";
export { default as GetFornecedorColumns } from "./GetFornecedorColumns";
export { default as useFornecedores } from "./useFornecedores";
export { default as ModalEditarFornecedor } from './ModalEditarFornecedor';