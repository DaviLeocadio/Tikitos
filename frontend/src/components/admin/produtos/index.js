import TableInline from "./TableInline";
import ModalEditarProduto from "./ModalEditarProduto";
import ModalDesativarProduto from "./ModalDesativarProduto";
import ProdutosFilters from "./ProdutosFilters";
import ProdutosTable from "./ProdutosTable";
import GetColumns from "./GetColumns";
import useProdutos from "./useProdutos";

const Components = {
  Table: TableInline.Table,
  TableHeader: TableInline.TableHeader,
  TableBody: TableInline.TableBody,
  TableRow: TableInline.TableRow,
  TableHead: TableInline.TableHead,
  TableCell: TableInline.TableCell,
  ModalEditarProduto,
  ModalDesativarProduto,
  ProdutosFilters,
  ProdutosTable,
  GetColumns,
  useProdutos,
};

export default Components;
export { default as ModalEditarProduto } from "./ModalEditarProduto";
export { default as ModalDesativarProduto } from './ModalDesativarProduto'
export { default as ProdutosFilters } from "./ProdutosFilters";
export { default as ProdutosTable } from "./ProdutosTable";
export { default as GetColumns } from "./GetColumns";
export { default as useProdutos } from "./useProdutos";
