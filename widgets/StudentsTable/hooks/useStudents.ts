import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid"
import { GridColDef } from "@mui/x-data-grid"
import { RoleUrlApi, useFetchAllGroupsQuery } from "~/shared/api"
import { useAppSelector } from "~/shared/lib/hooks"
import { usePaginationModel } from "~/shared/lib/hooks"
import { useSortModel } from "~/shared/lib/hooks/useSortModel"
import useThrottle from "~/shared/lib/hooks/useThrottle"
import { searchQuerySelector } from "~/shared/model/store"
import { GroupType, GroupsType, StudentType, StudentsType } from "~/shared/types/UserServiceTypes"

import { useStudentsTableApi } from "../api/useStudentsTableApi"
import { useGetColumns } from "../lib/useGetColumns"
import { filtersQuerySelector } from "../models/filters.selectors"

/**
 * Результат использования хука для компонента таблицы студентов.
 *
 * @property paginationModel - Модель пагинации, которая содержит информацию о текущей странице и размере страницы.
 * @property setPaginationModel - Функция для обновления модели пагинации.
 * @property sortModel - Модель сортировки, которая содержит информацию о поле и порядке сортировки.
 * @property setSortModel - Функция для обновления модели сортировки.
 * @property students - Список студентов, который отображается в таблице.
 * @property totalElements - Общее количество элементов, соответствующих текущим фильтрам и сортировке.
 * @property columnsHeaders - Массив определений колонок для таблицы.
 * @property isFetching - Логическое значение, которое указывает, выполняется ли запрос данных.
 */

type TableStudentsResult = {
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  setSortModel: (model: GridSortModel) => void
  students: StudentsType
  totalElements: number
  columnsHeaders: GridColDef[]
  isFetching: boolean
}

export const useTableStudents = (
  setIsDeletePopupOpen: (student: StudentType) => void,
  role: RoleUrlApi,
): TableStudentsResult => {
  const { paginationModel, setPaginationModel } = usePaginationModel()
  const { sortModel = [], setSortModel } = useSortModel()

  const sortParams = sortModel.length > 0 ? [sortModel[0].field, sortModel[0].sort] : []
  const searchQuery: string = useAppSelector(searchQuerySelector)
  const throttledSearchQuery = useThrottle(searchQuery)
  const filtersQuery: string[] = useAppSelector(filtersQuerySelector).map((el) => el.value)

  const { data: groupsData } = useFetchAllGroupsQuery()
  const groups: GroupsType = groupsData?.content || []

  const filteredGroups: GroupsType = groups.filter(
    (el: GroupType) => el?.directionId && filtersQuery.includes(el.directionId),
  )

  const filteredGroupsList: string[] = filteredGroups.map((el) => el?.directionId || "")

  const {
    students: studentsData = [],
    totalElements: allTotalElements = 0,
    isFetching,
  } = useStudentsTableApi(
    {
      sort: sortParams as [] | string[],
      search: throttledSearchQuery,
      roles: "STUDENT",
      page: paginationModel?.page,
      size: paginationModel?.pageSize,
    },
    role,
  )

  const allStudents: StudentsType =
    studentsData.filter((el: StudentType) =>
      filteredGroupsList.length
        ? el.groups?.some((item) => filteredGroupsList.includes(item.id))
        : true,
    ) || []

  const students = searchQuery ? studentsData : allStudents
  const totalElements: number = searchQuery ? studentsData.length : allTotalElements

  const columnsHeaders: GridColDef[] = useGetColumns(setIsDeletePopupOpen)

  return {
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    students,
    totalElements,
    columnsHeaders,
    isFetching,
  }
}
