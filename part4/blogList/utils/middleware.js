import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import logger from '../utils/logger.js';

const dataLog = (req, res, next) => {
  logger.info('Request Data:', {
    method: req.method,
    path: req.path,
    body: req.body,
  });
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
    return res.status(400).json({ error: 'duplicate key error' });
  }
  next(error);
};

const getTokenFrom = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
        console.log(`Extracted token: ${req.token}`); // Log the extracted token
    }
    next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
  
  if (decodedToken?.id) {
    req.user = await User.findById(decodedToken.id);
  }  
  next();
};

export { dataLog, unknownEndpoint, errorHandler, getTokenFrom, userExtractor };