import { configureStore } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import coursesReducer from './slices/coursesSlice'
import filtersReducer from './slices/filtersSlice'
import progressReducer from './slices/progressSlice'
import toastsReducer from './slices/toastSlice'
import { storageService } from '../utils/storage'

// Middleware to auto-save to localStorage
const storageMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action)
  const state = store.getState() as {
    courses: { courses: unknown[] }
    progress: { progress: Record<string, unknown> }
  }

  // Save courses to localStorage whenever courses state changes
  if ((action as { type: string }).type.startsWith('courses/')) {
    storageService.saveCourses(state.courses.courses as never[])
  }

  // Save progress to localStorage whenever progress state changes
  if ((action as { type: string }).type.startsWith('progress/')) {
    storageService.saveProgress(state.progress.progress as never)
  }

  return result
}

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    filters: filtersReducer,
    progress: progressReducer,
    toasts: toastsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(storageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

