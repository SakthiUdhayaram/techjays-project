import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import Toast from './Toast'
import { removeToast } from '../../store/slices/toastSlice'

const ToastContainer = () => {
  const toasts = useAppSelector((state) => state.toasts.toasts)
  const dispatch = useAppDispatch()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={(id) => dispatch(removeToast(id))} />
      ))}
    </div>
  )
}

export default ToastContainer

