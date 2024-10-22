import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "~/shared/model/store"

const filtersQuery = (state: RootState) => state.filtersStudentDirection.filtersQuery
export const filtersQuerySelector = createSelector([filtersQuery], (filtersQuery) => filtersQuery)
