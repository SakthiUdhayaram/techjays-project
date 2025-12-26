import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useAppSelector } from '../hooks/redux'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { calculateCourseProgress } from '../utils/helpers'

const COLORS = ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4']

const Dashboard: React.FC = () => {
  const { courses } = useAppSelector((state) => state.courses)
  const { progress } = useAppSelector((state) => state.progress)

  const stats = useMemo(() => {
    const totalCourses = courses.length
    const categories: Record<string, number> = {}
    const difficultyCount: Record<string, number> = { Beginner: 0, Intermediate: 0, Advanced: 0 }
    let completedCourses = 0
    let totalProgress = 0

    courses.forEach((course) => {
      categories[course.category] = (categories[course.category] || 0) + 1
      difficultyCount[course.difficulty] = (difficultyCount[course.difficulty] || 0) + 1
      const courseProgress = progress[course.id]
      if (courseProgress) {
        const progressPercent = calculateCourseProgress(course, courseProgress.completedLessons)
        totalProgress += progressPercent
        if (progressPercent === 100) completedCourses++
      }
    })

    return {
      totalCourses,
      completedCourses,
      avgProgress: totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0,
      categoryData: Object.entries(categories).map(([name, value]) => ({ name, value })),
      difficultyData: Object.entries(difficultyCount).map(([name, value]) => ({ name, value })),
    }
  }, [courses, progress])

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your Course Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold mt-2">{stats.completedCourses}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Progress</p>
                <p className="text-3xl font-bold mt-2">{stats.avgProgress}%</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold mt-2">{stats.totalCourses - stats.completedCourses}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-bold mb-4">Courses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {stats.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h2 className="text-xl font-bold mb-4">Courses by Difficulty</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.difficultyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link to="/courses/new"><Button>Create New Course</Button></Link>
            <Link to="/courses"><Button variant="secondary">View All Courses</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

