export interface Lesson {
  id: string
  title: string
  description: string
  content: string // Rich text HTML content
  order: number
}

export interface Section {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string // Rich text HTML content
  thumbnail: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  sections: Section[]
  createdAt: string
  updatedAt: string
}

export interface CourseProgress {
  courseId: string
  completedLessons: string[] // Array of lesson IDs
  lastAccessed: string
}

export interface FilterState {
  searchQuery: string
  category: string
  difficulty: string
  sortBy: 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc'
}

export type Category = 'Programming' | 'Design' | 'Business' | 'Marketing' | 'Data Science' | 'Other'

