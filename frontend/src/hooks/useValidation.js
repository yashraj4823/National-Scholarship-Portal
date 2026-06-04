import { useState, useRef } from 'react'

/**
 * useValidation — real-time field-level validation hook.
 *
 * @param {Object} rules  — { fieldName: (value, allValues) => errorString | '' }
 * @returns { errors, touched, validate, touch, touchAll, isValid }
 */
export function useValidation(rules) {
  // Store rules in a ref so the object reference never changes between renders
  const rulesRef = useRef(rules)
  rulesRef.current = rules

  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})

  /** Run rule for one field and update errors state */
  const validate = (name, value, allValues = {}) => {
    if (!rulesRef.current[name]) return ''
    const msg = rulesRef.current[name](value, allValues)
    setErrors(prev => ({ ...prev, [name]: msg || '' }))
    return msg || ''
  }

  /** Mark a field as touched (on blur) and validate it */
  const touch = (name, value, allValues = {}) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validate(name, value, allValues)
  }

  /** Touch and validate every field at once (called on submit) */
  const touchAll = (values) => {
    const newTouched = {}
    const newErrors  = {}
    Object.keys(rulesRef.current).forEach(name => {
      newTouched[name] = true
      newErrors[name]  = rulesRef.current[name](values[name] ?? '', values) || ''
    })
    setTouched(newTouched)
    setErrors(newErrors)
    return Object.values(newErrors).every(e => !e)
  }

  const isValid = Object.values(errors).every(e => !e)

  return { errors, touched, validate, touch, touchAll, isValid }
}
