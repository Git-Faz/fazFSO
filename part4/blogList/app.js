import 'express-async-errors'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {MONGODB_URI} from './utils/config.js'
import logger from './utils/logger.js'
import blogsRouter from './controllers/blogs.js'

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
app.use('/api/blogs',blogsRouter)

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Blog API</h1>')
})

export default app