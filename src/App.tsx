import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocalStorageSync } from './hooks/useLocalStorageSync'
import Navbar from './components/layout/Navbar'
import ToastContainer from './components/ui/ToastContainer'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const CourseList = lazy(() => import('./pages/CourseList'))
const CourseForm = lazy(() => import('./pages/CourseForm'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const LessonView = lazy(() => import('./pages/LessonView'))

const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  // CRITICAL: This hook ensures data is loaded from localStorage on app start
  // and saved before page unload
  useLocalStorageSync()

  return (
    <div className="min-h-screen">
      <Navbar />
      <ToastContainer />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/:id/edit" element={<CourseForm />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App

