/**
 * Module dependencies
 */
const api = require('express').Router();
const getLinesStatus = require('./linesStatus');

/**
 * Enable CORS
 */
api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * Add endpoint /api
 */
api.get('/', (req, res) => {
  getLinesStatus().then(response => res.status(200).json(response));
});

/**
 * 500 error handler
 */
// eslint-disable-next-line no-unused-vars
api.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 500 });
});

/**
 * 400 error handler
 */
api.use((req, res) => {
  res.status(404).json({ status: 404 });
});

/**
 * Expose api router
 */
module.exports = api;
