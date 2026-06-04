
export default function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
      <span aria-hidden="true">⚠</span> {message}
    </p>
  )
}
