import FinanceiroFilters from "./FinanceiroFilters";
import ResumoFinanceiro from "./ResumoFinanceiro";
import DespesasTable from "./DespesasTable";
import FluxoCaixaTable from "./FluxoCaixaTable";
import GetColumns from "./GetColumns";
import useFinanceiro from "./useFinanceiro";
import ModalAdicionarDespesa from "./ModalAdicionarDespesa";
import TableInline from "./TableInline";
import VendasTable from "./VendasTable";

const Components = {
  Table: TableInline.Table,
  TableHeader: TableInline.TableHeader,
  TableBody: TableInline.TableBody,
  TableRow: TableInline.TableRow,
  TableHead: TableInline.TableHead,
  TableCell: TableInline.TableCell,
  FinanceiroFilters,
  ResumoFinanceiro,
  DespesasTable,
  VendasTable,
  FluxoCaixaTable,
  GetColumns,
  useFinanceiro,
  ModalAdicionarDespesa,
};

export default Components;
export { default as FinanceiroFilters } from "./FinanceiroFilters";
export { default as ResumoFinanceiro } from "./ResumoFinanceiro";
export { default as DespesasTable } from "./DespesasTable";
export { default as FluxoCaixaTable } from "./FluxoCaixaTable";
export { default as VendasTable } from "./VendasTable";
export { default as GetColumns } from "./GetColumns";
export { default as useFinanceiro } from "./useFinanceiro";
export { default as ModalAdicionarDespesa } from "./ModalAdicionarDespesa";
