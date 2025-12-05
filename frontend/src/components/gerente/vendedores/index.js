import TableInline from "./TableInline";
import VendedoresFilters from "./VendedoresFilters";
import VendedoresTable from "./VendedoresTable";
import GetColumns from "./GetColumns";
import useVendedores from "./useVendedores";
import ModalEditarVendedor from "./ModalEditarVendedor";
import ModalDesativarVendedor from "./ModalDesativarVendedor";

const Components = {
  Table: TableInline.Table,
  TableHeader: TableInline.TableHeader,
  TableBody: TableInline.TableBody,
  TableRow: TableInline.TableRow,
  TableHead: TableInline.TableHead,
  TableCell: TableInline.TableCell,
  VendedoresFilters,
  VendedoresTable,
  GetColumns,
  useVendedores,
  ModalEditarVendedor,
  ModalDesativarVendedor,
};

export default Components;
export { default as VendedoresFilters } from "./VendedoresFilters";
export { default as VendedoresTable } from "./VendedoresTable";
export { default as GetColumns } from "./GetColumns";
export { default as useVendedores } from "./useVendedores";
export { default as ModalEditarVendedor } from './ModalEditarVendedor';
export { default as ModalDesativarVendedor } from './ModalDesativarVendedor';
