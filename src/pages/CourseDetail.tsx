import React, { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { deleteCourse } from '../store/slices/coursesSlice'
import { updateLessonProgress } from '../store/slices/progressSlice'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { calculateCourseProgress } from '../utils/helpers'
import DOMPurify from 'dompurify'
import type { Course } from '../types'

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.courses)
  const { progress } = useAppSelector((state) => state.progress)
  const course = courses.find((c: Course) => c.id === id)
  const courseProgress = course ? progress[course.id] : null
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const progressPercent = useMemo(() => {
    if (!course || !courseProgress) return 0
    return calculateCourseProgress(course, courseProgress.completedLessons)
  }, [course, courseProgress])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <Link to="/courses"><Button>Back to Courses</Button></Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/courses" className="text-blue-600 mb-4 inline-block">← Back</Link>
        <div className="flex gap-6 mb-8">
          <img src={course.thumbnail || 'https://via.placeholder.com/400x300'} alt={course.title} className="w-80 h-64 object-cover rounded-xl" />
          <div className="flex-1">
            <div className="flex gap-2 mb-4"><Badge>{course.category}</Badge><Badge variant={course.difficulty === 'Beginner' ? 'success' : course.difficulty === 'Intermediate' ? 'warning' : 'danger'}>{course.difficulty}</Badge></div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.description) }} className="mb-6" />
            {courseProgress && (
              <div className="mb-6">
                <div className="flex justify-between mb-2"><span>Progress</span><span>{progressPercent}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progressPercent}%` }} /></div>
              </div>
            )}
            <div className="flex gap-4">
              <Link to={`/courses/${course.id}/edit`}><Button>Edit</Button></Link>
              <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
            </div>
          </div>
        </div>
        <Card>
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>
          {course.sections.map((section, idx) => (
            <div key={section.id} className="mb-4 border rounded-lg overflow-hidden">
              <button onClick={() => setExpandedSections(prev => { const n = new Set(prev); n.has(section.id) ? n.delete(section.id) : n.add(section.id); return n })} className="w-full p-4 flex justify-between items-center hover:bg-gray-50">
                <div><h3 className="font-semibold">Section {idx + 1}: {section.title}</h3><p className="text-sm text-gray-600">{section.lessons.length} lessons</p></div>
                <span>{expandedSections.has(section.id) ? '▼' : '▶'}</span>
              </button>
              {expandedSections.has(section.id) && (
                <div className="p-4 bg-gray-50">
                  {section.lessons.map((lesson, lidx) => {
                    const isCompleted = courseProgress?.completedLessons.includes(lesson.id) || false
                    return (
                      <div key={lesson.id} className="mb-2 p-3 bg-white rounded flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={isCompleted} onChange={(e) => dispatch(updateLessonProgress({ courseId: course.id, lessonId: lesson.id, completed: e.target.checked }))} />
                          <Link to={`/courses/${course.id}/lessons/${lesson.id}`} className="font-medium">{lesson.title || `Lesson ${lidx + 1}`}</Link>
                        </div>
                        <Link to={`/courses/${course.id}/lessons/${lesson.id}`}><Button size="sm">View</Button></Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </Card>
        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Course" footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { dispatch(deleteCourse(course.id)); navigate('/courses') }}>Delete</Button></>}>
          <p>Are you sure? This cannot be undone.</p>
        </Modal>
      </div>
    </div>
  )
}

export default CourseDetail

