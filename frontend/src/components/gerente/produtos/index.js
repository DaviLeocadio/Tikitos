import TableInline from "./TableInline";
import ModalEditarDesconto from "./ModalEditarDesconto";
import ModalPedidoFornecedor from "./ModalPedidoFornecedor";
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
  ModalEditarDesconto,
  ModalPedidoFornecedor,
  ProdutosFilters,
  ProdutosTable,
  GetColumns,
  useProdutos,
};

export default Components;
export { default as ModalEditarDesconto } from "./ModalEditarDesconto";
export { default as ModalPedidoFornecedor } from "./ModalPedidoFornecedor";
export { default as ProdutosFilters } from "./ProdutosFilters";
export { default as ProdutosTable } from "./ProdutosTable";
export { default as GetColumns } from "./GetColumns";
export { default as useProdutos } from "./useProdutos";
