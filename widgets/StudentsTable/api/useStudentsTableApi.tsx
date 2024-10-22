import { IQueryParams, RoleUrlApi, useFetchUsersQuery } from "~/shared/api"

export const useStudentsTableApi = (queryOption: IQueryParams, role: RoleUrlApi) => {
  const {
    data: usersData,
    error: errorFetchUsers,
    isFetching,
  } = useFetchUsersQuery({ role, queryParams: queryOption })
  const students = usersData?.content
  const totalElements = usersData?.totalElements
  return { students, errorFetchUsers, totalElements, isFetching }
}
