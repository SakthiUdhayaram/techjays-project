import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux'
import { loadCoursesFromStorage } from '../store/slices/coursesSlice'
import { loadProgressFromStorage } from '../store/slices/progressSlice'
import { storageService } from '../utils/storage'

export const useLocalStorageSync = () => {
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.courses)
  const { progress } = useAppSelector((state) => state.progress)

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data from localStorage on app start...')
    const savedCourses = storageService.getCourses()
    const savedProgress = storageService.getProgress()

    // Always reload from storage on mount to ensure we have the latest data
    if (savedCourses.length > 0) {
      dispatch(loadCoursesFromStorage())
      console.log('Loaded courses from storage:', savedCourses.length)
    }

    if (Object.keys(savedProgress).length > 0) {
      dispatch(loadProgressFromStorage())
      console.log('Loaded progress from storage')
    }
  }, [dispatch])

  // Save to localStorage before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Saving data to localStorage before page unload...')
      storageService.saveCourses(courses)
      storageService.saveProgress(progress)
    }

    // Save periodically (every 5 seconds) as backup
    const interval = setInterval(() => {
      storageService.saveCourses(courses)
      storageService.saveProgress(progress)
    }, 5000)

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Final save on cleanup
      storageService.saveCourses(courses)
      storageService.saveProgress(progress)
    }
  }, [courses, progress])
}

