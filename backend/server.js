const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173']

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error('CORS policy violation'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/students', require('./routes/student.routes'))
app.use('/api/institutes', require('./routes/institute.routes'))
app.use('/api/applications', require('./routes/application.routes'))
app.use('/api/schemes', require('./routes/scheme.routes'))
app.use('/api/state', require('./routes/state.routes'))
app.use('/api/ministry', require('./routes/ministry.routes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'NSP Backend is running' }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  retryWrites: true,
}

if (process.env.MONGO_TLS === 'true') {
  mongooseOptions.tls = true
}

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`NSP Backend running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })

// Log mongoose connection events
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected — retrying...'))
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'))
