import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import cors from 'cors'
import {MONGODB_URI} from './utils/config.js'
import logger from './utils/logger.js'
import blogsRouter from './controllers/blogs.js'
import userRouter from './controllers/users.js'
import loginRouter from './controllers/login.js' 
import {dataLog,errorHandler, getTokenFrom, unknownEndpoint} from './utils/middleware.js'

const app = express()

// Connect to MongoDB
mongoose.set('strictQuery', false);
logger.info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  })


app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Middleware for logging request data
app.use(dataLog)
// Middleware for extracting token from request headers
app.use(getTokenFrom)

app.use('/api/blogs',blogsRouter)
app.use('/api/users',userRouter)
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
  res.send('<h1>Blog API</h1>')
})

// Middleware for handling unknown endpoints and errors
app.use(unknownEndpoint)
// Middleware for handling errors
app.use(errorHandler)

export default app