import type { Course, CourseProgress } from '../types'

const COURSES_KEY = 'course_management_courses'
const PROGRESS_KEY = 'course_management_progress'

export const storageService = {
  // Courses
  getCourses: (): Course[] => {
    try {
      const data = localStorage.getItem(COURSES_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return Array.isArray(parsed) ? parsed : []
      }
      return []
    } catch (error) {
      console.error('Error loading courses from storage:', error)
      return []
    }
  },

  saveCourses: (courses: Course[]): void => {
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
      console.log('Courses saved to localStorage:', courses.length)
    } catch (error) {
      console.error('Error saving courses to storage:', error)
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please delete some courses.')
      }
    }
  },

  // Progress
  getProgress: (): Record<string, CourseProgress> => {
    try {
      const data = localStorage.getItem(PROGRESS_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return parsed && typeof parsed === 'object' ? parsed : {}
      }
      return {}
    } catch (error) {
      console.error('Error loading progress from storage:', error)
      return {}
    }
  },

  saveProgress: (progress: Record<string, CourseProgress>): void => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
      console.log('Progress saved to localStorage')
    } catch (error) {
      console.error('Error saving progress to storage:', error)
    }
  },

  updateLessonProgress: (courseId: string, lessonId: string, completed: boolean): void => {
    const progress = storageService.getProgress()
    if (!progress[courseId]) {
      progress[courseId] = {
        courseId,
        completedLessons: [],
        lastAccessed: new Date().toISOString(),
      }
    }

    if (completed) {
      if (!progress[courseId].completedLessons.includes(lessonId)) {
        progress[courseId].completedLessons.push(lessonId)
      }
    } else {
      progress[courseId].completedLessons = progress[courseId].completedLessons.filter(
        (id) => id !== lessonId
      )
    }

    progress[courseId].lastAccessed = new Date().toISOString()
    storageService.saveProgress(progress)
  },
}

