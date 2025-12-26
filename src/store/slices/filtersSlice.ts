import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FilterState } from '../../types'

const initialState: FilterState = {
  searchQuery: '',
  category: '',
  difficulty: '',
  sortBy: 'date-desc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setDifficulty: (state, action: PayloadAction<string>) => {
      state.difficulty = action.payload
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload
    },
    resetFilters: (state) => {
      state.searchQuery = ''
      state.category = ''
      state.difficulty = ''
      state.sortBy = 'date-desc'
    },
  },
})

export const { setSearchQuery, setCategory, setDifficulty, setSortBy, resetFilters } =
  filtersSlice.actions
export default filtersSlice.reducer

