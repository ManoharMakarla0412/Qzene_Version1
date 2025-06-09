const { StatusCodes, getReasonPhrase } = require('http-status-codes');

/**
 * Sends a successful JSON response with data.
 * 
 * @param {Response} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Optional custom message
 * @param {number} status - HTTP status code (default: 200 OK)
 */
const sendResponse = (res, data, message = getReasonPhrase(StatusCodes.OK), status = StatusCodes.OK) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends an error JSON response.
 * 
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 400 Bad Request)
 */
const sendError = (res, message = getReasonPhrase(StatusCodes.BAD_REQUEST), status = StatusCodes.BAD_REQUEST) => {
  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = { sendResponse, sendError };
