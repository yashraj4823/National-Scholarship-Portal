const jwt = require('jsonwebtoken')

/**
 * Verify JWT token attached as Bearer token in Authorization header.
 * Attaches decoded payload to req.user.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' })
  }
}

/**
 * Restrict access to specific roles.
 * Usage: authorize('student'), authorize('institute', 'state')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
