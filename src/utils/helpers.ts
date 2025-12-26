import type { Course } from '../types'

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const calculateCourseProgress = (
  course: Course,
  completedLessons: string[]
): number => {
  const totalLessons = course.sections.reduce(
    (total, section) => total + section.lessons.length,
    0
  )
  if (totalLessons === 0) return 0
  return Math.round((completedLessons.length / totalLessons) * 100)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

