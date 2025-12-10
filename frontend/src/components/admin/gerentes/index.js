import TableInline from "./TableInline";
import GerentesFilters from "./GerentesFilters";
import GerentesTable from "./GerentesTable";
import GetColumns from "./GetColumns";
import useGerentes from "./useGerentes";
import ModalEditarGerente from "./ModalEditarGerente";
import ModalDesativarGerente from "./ModalDesativarGerente";

const Components = {
  Table: TableInline.Table,
  TableHeader: TableInline.TableHeader,
  TableBody: TableInline.TableBody,
  TableRow: TableInline.TableRow,
  TableHead: TableInline.TableHead,
  TableCell: TableInline.TableCell,
  GerentesFilters,
  GerentesTable,
  GetColumns,
  useGerentes,
  ModalEditarGerente,
  ModalDesativarGerente,
};

export default Components;
export { default as GerentesFilters } from "./GerentesFilters";
export { default as GerentesTable } from "./GerentesTable";
export { default as GetColumns } from "./GetColumns";
export { default as useGerentes } from "./useGerentes";
export { default as ModalEditarGerente } from './ModalEditarGerente';
export { default as ModalDesativarGerente } from './ModalDesativarGerente';
