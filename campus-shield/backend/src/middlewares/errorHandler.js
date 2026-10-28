import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert known external errors to ApiError
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Resource not found with id: ${err.value}`);
  } else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest(messages.join(', '), messages);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`An item with that ${field} already exists`);
  } else if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authorization token');
  } else if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authorization token has expired');
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    error = ApiError.badRequest(
      `Image file size exceeds the ${env.MAX_FILE_SIZE_MB || 5}MB maximum allowed limit.`
    );
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const statusCode = error.statusCode || 500;
  const responsePayload = {
    success: false,
    message: error.message || 'Server Error',
    errors: error.errors || [],
    ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(statusCode).json(responsePayload);
};

