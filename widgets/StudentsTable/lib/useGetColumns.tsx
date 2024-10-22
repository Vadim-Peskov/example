import { IconButton } from "@mui/material"
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { Delete } from "assets/svgr"
import { StudentType } from "~/shared/types/UserServiceTypes"

import { defaultValueColumn } from "./const"

/**
 * @prop setIsDeletePopupOpen - Функция для установки флага открытия диалога удаления.
 */

export const useGetColumns = (
  setIsDeletePopupOpen: (student: StudentType) => void,
): GridColDef[] => {
  return [
    {
      field: "firstName",
      headerName: "Имя",
      flex: 0.5,
    },
    {
      field: "lastName",
      headerName: "Фамилия",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.5,
    },
    {
      field: "role",
      valueGetter: (params: GridValueGetterParams) => {
        const role = params.row.roles
        return role ? role[0].name : ""
      },
      headerName: "Роль",
      flex: 0.3,
    },
    {
      field: "group",
      valueGetter: (params: GridValueGetterParams) => {
        const group = params.row.groups
        return group ? group[0].name : ""
      },
      headerName: "Группа",
      flex: 0.5,
    },
    {
      field: "actions",
      type: "actions",
      renderCell: ({ row }: GridRenderCellParams) => (
        <IconButton
          aria-label='delete'
          size='small'
          sx={{ padding: 0, margin: 0.5 }}
          onClick={() => {
            setIsDeletePopupOpen(row)
          }}
        >
          <Delete fill='#EBEBEB' width={34} height={34} />
        </IconButton>
      ),
    },
  ].map((headerColumn) =>
    headerColumn.field === "actions" ? headerColumn : { ...headerColumn, ...defaultValueColumn },
  )
}
