// Usage examples:
// <Loader />                    → centered spinner, default size
// <Loader size="sm" />          → small spinner
// <Loader fullScreen />         → takes up entire viewport (used in ProtectedRoute)
// <Loader text="Loading events..." /> → spinner with message below

export default function Loader({ size = 'md', fullScreen = false, text = '' }) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }[size]

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClass} animate-spin rounded-full border-muted border-t-primary`}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  )
}