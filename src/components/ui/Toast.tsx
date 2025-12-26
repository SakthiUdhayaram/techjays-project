import { useEffect } from 'react'
import type { Toast as ToastType } from '../../store/slices/toastSlice'

interface ToastProps extends ToastType {
  onClose: (id: string) => void
}

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  return (
    <div className={`${styles[type]} border-l-4 rounded-lg shadow-lg p-4 mb-3 flex items-center gap-3 min-w-[300px]`}>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">✕</button>
    </div>
  )
}

export default Toast

