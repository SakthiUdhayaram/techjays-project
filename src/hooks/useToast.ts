import { useAppDispatch } from './redux'
import { addToast } from '../store/slices/toastSlice'

export const useToast = () => {
  const dispatch = useAppDispatch()

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
    dispatch(addToast({ message, type, duration }))
  }

  return {
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  }
}

