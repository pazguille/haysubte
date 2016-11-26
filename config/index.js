let config;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  config = require('./production.js');
} else {
  config = require('./development.js');
}

/**
 * Expose the correct environment config
 */
module.exports = config;
