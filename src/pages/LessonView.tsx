import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { updateLessonProgress } from '../store/slices/progressSlice'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DOMPurify from 'dompurify'
import type { Course, Lesson, Section } from '../types'

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.courses)
  const { progress } = useAppSelector((state) => state.progress)
  const course = courses.find((c: Course) => c.id === courseId)

  if (!course || !lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center"><h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2><Link to={courseId ? `/courses/${courseId}` : '/courses'}><Button>Back</Button></Link></Card>
      </div>
    )
  }

  let lesson: Lesson | null = null
  let section: Section | null = null
  let lessonIndex = 0
  let sectionIndex = 0

  for (let i = 0; i < course.sections.length; i++) {
    const sec = course.sections[i]
    const foundLesson = sec.lessons.find((l: Lesson) => l.id === lessonId)
    if (foundLesson) {
      lesson = foundLesson
      section = sec
      lessonIndex = sec.lessons.findIndex((l: Lesson) => l.id === lessonId)
      sectionIndex = i
      break
    }
  }

  if (!lesson || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center"><h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2><Link to={`/courses/${courseId}`}><Button>Back</Button></Link></Card>
      </div>
    )
  }

  const courseProgress = progress[course.id]
  const isCompleted = courseProgress?.completedLessons.includes(lesson.id) || false

  const allLessons: Array<{ lesson: Lesson; section: Section }> = []
  course.sections.forEach((sec: Section) => {
    sec.lessons.forEach((les: Lesson) => {
      allLessons.push({ lesson: les, section: sec })
    })
  })

  const currentIndex = allLessons.findIndex((l) => l.lesson.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to={`/courses/${courseId}`} className="text-blue-600 mb-4 inline-block">← Back to Course</Link>
        <Card className="p-8">
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-4">Section {sectionIndex + 1} • Lesson {lessonIndex + 1}</div>
            <h1 className="text-4xl font-bold mb-4">{lesson.title || `Lesson ${lessonIndex + 1}`}</h1>
            {lesson.description && <p className="text-lg text-gray-600 mb-6">{lesson.description}</p>}
          </div>
          <div className="mb-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content || '<p>No content available.</p>') }} />
          <div className="flex items-center justify-between pt-6 border-t">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isCompleted} onChange={(e) => dispatch(updateLessonProgress({ courseId: course.id, lessonId: lesson.id, completed: e.target.checked }))} className="w-5 h-5" />
              <span>Mark as {isCompleted ? 'incomplete' : 'complete'}</span>
            </label>
            <div className="flex gap-4">
              {prevLesson && <Link to={`/courses/${courseId}/lessons/${prevLesson.lesson.id}`}><Button variant="secondary">← Previous</Button></Link>}
              {nextLesson && <Link to={`/courses/${courseId}/lessons/${nextLesson.lesson.id}`}><Button>Next →</Button></Link>}
              {!nextLesson && <Link to={`/courses/${courseId}`}><Button>Back to Course</Button></Link>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LessonView

