/**
 * Returns the correct CSS classes for an input / select depending on
 * whether it has a validation error.
 *
 * @param {string} base     — base class ('form-input' or 'form-select')
 * @param {string} error    — error message string (empty = no error)
 * @param {boolean} touched — whether the field has been touched
 */
export function fieldClass(base, error, touched) {
  if (touched && error) return `${base} border-red-400 focus:ring-red-300 bg-red-50`
  if (touched && !error) return `${base} border-green-400 focus:ring-green-300`
  return base
}
