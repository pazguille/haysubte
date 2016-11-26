/**
 * Module dependencies
 */
const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const config = require('./config');
const api = require('./api');

/**
 * Create app and router
 */
const app = express();

/**
 * Add middlewares
 */
app.use(compression());
app.use(helmet());
app.use(hpp());

/**
 * Add router
 */
app.use('/api', api);

/**
 * Cluster
 */
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  app.listen(config.server.port, () => {
    console.log(`App listening on port ${config.server.port}.`);
  });
}

/**
 * Handle unhandled exceptions
 */
process.on('unhandledException', err => console.log(err.toString()));

/**
 * Expose app
 */
module.exports = app;
