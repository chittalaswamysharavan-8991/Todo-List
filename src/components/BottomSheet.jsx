import { X } from 'lucide-react'

export default function BottomSheet({ open, title, onClose, children }) {
  if (!open) return null

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
