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
const pages = require('./app');

/**
 * Create app and router
 */
const app = express();

/**
 * Set express trust proxy
 */
app.set('trust proxy', true);

/**
 * Set static directory
 */
app.use(express.static(__dirname + '/public'));

/**
 * Add middlewares
 */
app.use(compression());
app.use(helmet());
app.use(hpp());

/**
 * Ping route
 */
app.get('/ping', (req, res) => res.send('Pong'));

/**
 * Add router
 */
app.use('/api', api);

/**
 * Mount template router
 */
app.use('/', pages);

/**
 * Port
 */
const port = process.env.PORT || config.server.port;

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
  app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port ${port}.`);
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
