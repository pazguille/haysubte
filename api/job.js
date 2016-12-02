/**
 * Module dependencies
 */
const { CronJob } = require('cron');
const { getLinesStatusOnline } = require('./linesStatus');

/**
 * Runs job every 5 minutes
 */
const job = new CronJob({
  cronTime: '*/5 * * * *',
  onTick() { getLinesStatusOnline(); },
  runOnInit: true,
});

/**
 * Expose job
 */
module.exports = job;
