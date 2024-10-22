import { GridColDef } from "@mui/x-data-grid"

export const defaultValueColumn: Omit<GridColDef, "field"> = {
  width: 100,
  hideSortIcons: true,
  headerAlign: "center",
}
