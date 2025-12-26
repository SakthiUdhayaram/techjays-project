import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Course } from '../../types'
import { storageService } from '../../utils/storage'

interface CoursesState {
  courses: Course[]
  loading: boolean
  error: string | null
}

// Load initial state from localStorage
const initialState: CoursesState = {
  courses: storageService.getCourses(),
  loading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload)
      // Save to localStorage immediately
      storageService.saveCourses(state.courses)
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.courses[index] = action.payload
        // Save to localStorage immediately
        storageService.saveCourses(state.courses)
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload)
      // Save to localStorage immediately
      storageService.saveCourses(state.courses)
    },
    deleteCourses: (state, action: PayloadAction<string[]>) => {
      state.courses = state.courses.filter((c) => !action.payload.includes(c.id))
      // Save to localStorage immediately
      storageService.saveCourses(state.courses)
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
      // Save to localStorage immediately
      storageService.saveCourses(state.courses)
    },
    loadCoursesFromStorage: (state) => {
      // Reload from localStorage
      state.courses = storageService.getCourses()
    },
  },
})

export const { addCourse, updateCourse, deleteCourse, deleteCourses, setCourses, loadCoursesFromStorage } =
  coursesSlice.actions
export default coursesSlice.reducer

