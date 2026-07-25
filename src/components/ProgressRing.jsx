export default function ProgressRing({ progress, label, sublabel }) {
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const offset = circumference - Math.min(Math.max(progress, 0), 1) * circumference

  return (
    <div className="ring-wrap" aria-label={`${Math.round(progress * 100)} percent complete`}>
      <svg className="ring" viewBox="0 0 200 200" role="img">
        <circle className="ring-track" cx="100" cy="100" r={radius} />
        <circle
          className="ring-progress"
          cx="100"
          cy="100"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-content">
        <span className="ring-label">{label}</span>
        <span className="ring-sublabel">{sublabel}</span>
      </div>
    </div>
  )
}
