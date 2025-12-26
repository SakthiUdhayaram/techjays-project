import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CourseProgress } from '../../types'
import { storageService } from '../../utils/storage'

interface ProgressState {
  progress: Record<string, CourseProgress>
}

// Load initial state from localStorage
const initialState: ProgressState = {
  progress: storageService.getProgress(),
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateLessonProgress: (
      state,
      action: PayloadAction<{ courseId: string; lessonId: string; completed: boolean }>
    ) => {
      const { courseId, lessonId, completed } = action.payload

      if (!state.progress[courseId]) {
        state.progress[courseId] = {
          courseId,
          completedLessons: [],
          lastAccessed: new Date().toISOString(),
        }
      }

      if (completed) {
        if (!state.progress[courseId].completedLessons.includes(lessonId)) {
          state.progress[courseId].completedLessons.push(lessonId)
        }
      } else {
        state.progress[courseId].completedLessons = state.progress[courseId].completedLessons.filter(
          (id) => id !== lessonId
        )
      }

      state.progress[courseId].lastAccessed = new Date().toISOString()
      // Save to localStorage immediately
      storageService.saveProgress(state.progress)
    },
    setProgress: (state, action: PayloadAction<Record<string, CourseProgress>>) => {
      state.progress = action.payload
      // Save to localStorage immediately
      storageService.saveProgress(state.progress)
    },
    loadProgressFromStorage: (state) => {
      // Reload from localStorage
      state.progress = storageService.getProgress()
    },
  },
})

export const { updateLessonProgress, setProgress, loadProgressFromStorage } = progressSlice.actions
export default progressSlice.reducer

