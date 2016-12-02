/**
 * Module dependencies
 */
const app = require('express').Router();
const getLinesStatus = require('../api/linesStatus');
const ViewResolver = require('./view-resolver');

/**
 * Template View
 */
const templatePath = require.resolve('./index.pug');
const view = new ViewResolver(templatePath);

/**
 * Add endpoint /api
 */
app.get('/', (req, res) => {
  getLinesStatus().then((lines) => {
    // 5 minutes
    // res.header('Cache-Control', 'public, max-age=300000');
    view.render({ lines }, res);
  });
});

/**
 * 500 error handler
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
});

/**
 * 400 error handler
 */
app.use((req, res) => {
  res.status(404);
});

/**
 * Expose api router
 */
module.exports = app;
