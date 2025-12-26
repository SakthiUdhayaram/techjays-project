import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { addCourse, updateCourse } from '../store/slices/coursesSlice'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import RichTextEditor from '../components/RichTextEditor'
import Card from '../components/ui/Card'
import { generateId } from '../utils/helpers'
import { useToast } from '../hooks/useToast'
import type { Course, Section, Lesson } from '../types'

const CourseForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.courses)
  const toast = useToast()
  const isEditMode = !!id
  const existingCourse = isEditMode ? courses.find((c: Course) => c.id === id) : null

  const [formData, setFormData] = useState({ title: '', description: '', thumbnail: '', category: 'Programming', difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' })
  const [sections, setSections] = useState<Section[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (existingCourse) {
      setFormData({ title: existingCourse.title, description: existingCourse.description, thumbnail: existingCourse.thumbnail, category: existingCourse.category, difficulty: existingCourse.difficulty })
      setSections(existingCourse.sections)
    }
  }, [existingCourse])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim() || formData.title.length < 10 || formData.title.length > 60) {
      newErrors.title = 'Title must be between 10 and 60 characters'
    }
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.thumbnail.trim()) newErrors.thumbnail = 'Thumbnail URL is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the errors')
      return
    }

    const courseData: Course = {
      id: existingCourse?.id || generateId(),
      ...formData,
      sections: sections.map((s, i) => ({ ...s, order: i, lessons: s.lessons.map((l, li) => ({ ...l, order: li })) })),
      createdAt: existingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditMode) {
      dispatch(updateCourse(courseData))
      toast.success('Course updated!')
    } else {
      dispatch(addCourse(courseData))
      toast.success('Course created!')
    }
    setTimeout(() => navigate('/courses'), 500)
  }

  const addSection = () => {
    setSections([...sections, { id: generateId(), title: '', description: '', order: sections.length, lessons: [] }])
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s))
  }

  const addLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      updateSection(sectionId, { lessons: [...section.lessons, { id: generateId(), title: '', description: '', content: '', order: section.lessons.length }] })
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-6">
              <Input label="Course Title *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} error={errors.title} />
              <RichTextEditor label="Description" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />
              <Input label="Thumbnail URL *" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} error={errors.thumbnail} />
              <div className="grid grid-cols-2 gap-6">
                <Select label="Category *" options={[{ value: 'Programming', label: 'Programming' }, { value: 'Design', label: 'Design' }, { value: 'Business', label: 'Business' }, { value: 'Marketing', label: 'Marketing' }, { value: 'Data Science', label: 'Data Science' }, { value: 'Other', label: 'Other' }]} value={formData.category || 'Programming'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} error={errors.category} />
                <Select label="Difficulty *" options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })} />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Course Content</h2>
              <Button type="button" onClick={addSection}>+ Add Section</Button>
            </div>
            {sections.map((section, idx) => (
              <div key={section.id} className="mb-4 p-4 border rounded-lg">
                <Input label={`Section ${idx + 1} Title`} value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} />
                <Input label="Description" value={section.description} onChange={(e) => updateSection(section.id, { description: e.target.value })} className="mt-4" />
                <div className="mt-4">
                  <Button type="button" size="sm" onClick={() => addLesson(section.id)}>+ Add Lesson</Button>
                  {section.lessons.map((lesson, lidx) => (
                    <div key={lesson.id} className="mt-4 p-4 bg-gray-50 rounded">
                      <Input label={`Lesson ${lidx + 1} Title`} value={lesson.title} onChange={(e) => updateSection(section.id, { lessons: section.lessons.map(l => l.id === lesson.id ? { ...l, title: e.target.value } : l) })} />
                      <RichTextEditor value={lesson.content} onChange={(value) => updateSection(section.id, { lessons: section.lessons.map(l => l.id === lesson.id ? { ...l, content: value } : l) })} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <div className="flex gap-4">
            <Button type="submit">{isEditMode ? 'Update Course' : 'Create Course'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/courses')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseForm

