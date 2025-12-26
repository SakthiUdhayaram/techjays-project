import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { setSearchQuery, setCategory, setDifficulty, setSortBy } from '../store/slices/filtersSlice'
import { deleteCourse, deleteCourses } from '../store/slices/coursesSlice'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import { useToast } from '../hooks/useToast'

const ITEMS_PER_PAGE = 10

const CourseList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.courses)
  const filters = useAppSelector((state) => state.filters)
  const toast = useToast()
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses]
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(query) || c.category.toLowerCase().includes(query))
    }
    if (filters.category) filtered = filtered.filter((c) => c.category === filters.category)
    if (filters.difficulty) filtered = filtered.filter((c) => c.difficulty === filters.difficulty)
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title-asc': return a.title.localeCompare(b.title)
        case 'title-desc': return b.title.localeCompare(a.title)
        case 'date-asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'date-desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default: return 0
      }
    })
    return filtered
  }, [courses, filters])

  const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE)
  const paginatedCourses = filteredAndSortedCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleDelete = (id: string) => {
    setCourseToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (courseToDelete) {
      dispatch(deleteCourse(courseToDelete))
      toast.success('Course deleted successfully')
      setDeleteModalOpen(false)
      setCourseToDelete(null)
    }
  }

  const handleBulkDelete = () => {
    if (selectedCourses.length > 0) {
      dispatch(deleteCourses(selectedCourses))
      toast.success(`${selectedCourses.length} course(s) deleted`)
      setSelectedCourses([])
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Courses</h1>
            <p className="text-gray-600">{filteredAndSortedCourses.length} course(s) found</p>
          </div>
          <Link to="/courses/new"><Button>+ Create New Course</Button></Link>
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search..." value={filters.searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))} />
            <Select options={[{ value: '', label: 'All Categories' }, { value: 'Programming', label: 'Programming' }, { value: 'Design', label: 'Design' }, { value: 'Business', label: 'Business' }]} value={filters.category} onChange={(e) => dispatch(setCategory(e.target.value))} />
            <Select options={[{ value: '', label: 'All Difficulties' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} value={filters.difficulty} onChange={(e) => dispatch(setDifficulty(e.target.value))} />
            <Select options={[{ value: 'date-desc', label: 'Newest' }, { value: 'date-asc', label: 'Oldest' }, { value: 'title-asc', label: 'A-Z' }, { value: 'title-desc', label: 'Z-A' }]} value={filters.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value as any))} />
          </div>
          {selectedCourses.length > 0 && (
            <div className="mt-4">
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete Selected ({selectedCourses.length})</Button>
            </div>
          )}
        </Card>

        {paginatedCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-4">No courses found</h3>
            <Link to="/courses/new"><Button>Create Your First Course</Button></Link>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedCourses.map((course) => (
                <Card key={course.id}>
                  <div className="relative h-48 overflow-hidden rounded-t-xl mb-4">
                    <img src={course.thumbnail || 'https://via.placeholder.com/400x300'} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4"><Badge>{course.category}</Badge></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant={course.difficulty === 'Beginner' ? 'success' : course.difficulty === 'Intermediate' ? 'warning' : 'danger'}>{course.difficulty}</Badge>
                    <span className="text-sm text-gray-500">{course.sections.length} sections</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/courses/${course.id}`} className="flex-1"><Button variant="secondary" size="sm" className="w-full">View</Button></Link>
                    <Link to={`/courses/${course.id}/edit`} className="flex-1"><Button variant="secondary" size="sm" className="w-full">Edit</Button></Link>
                    <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(course.id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </>
        )}

        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Course" footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></>}>
          <p>Are you sure you want to delete this course? This action cannot be undone.</p>
        </Modal>
      </div>
    </div>
  )
}

export default CourseList

