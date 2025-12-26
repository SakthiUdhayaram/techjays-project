import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Enter content...', label }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      })

      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          onChangeRef.current(quillRef.current.root.innerHTML)
        }
      })

      if (value) quillRef.current.root.innerHTML = value
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [placeholder])

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="bg-white rounded-lg border border-gray-300">
        <div ref={editorRef} className="min-h-[200px]" />
      </div>
    </div>
  )
}

export default RichTextEditor

