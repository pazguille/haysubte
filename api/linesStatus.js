/**
 * Module dependencies
 */
const { StaticScraper } = require('scraperjs');
const LRUCache = require('stale-lru-cache-cluster');

/**
 * Create cache
 */
const cache = LRUCache();

/**
 * Metro lines
 * 'P', 'U'
 */
const lines = ['A', 'B', 'C', 'D', 'E', 'H'];

/**
 * Scrap lines and built a response
 */
function scrapLinesStatus($) {
  const response = {};
  lines.forEach((line) => {
    const $line = $(`#status-line-${line}-container`);
    response[line] = {
      status: $line.attr('class').trim().split(' ')[1] || 'normal',
      text: $line.text().trim(),
    };
  });
  cache.set('lines', response);
  return response;
}

/**
 * getLinesStatusOnline
 */
function getLinesStatusOnline() {
  StaticScraper.create('http://www.metrovias.com.ar/')
    .scrape(scrapLinesStatus);
}

/**
 * getLinesStatus
 */
function getLinesStatus() {
  return cache.has('lines')
    .then((exists) => {
      if (exists) {
        return cache.get('lines');
      }
      return getLinesStatusOnline();
    });
}

/**
 * Expose getLinesStatus
 */
exports = module.exports = getLinesStatus;

/**
 * Expose getLinesStatusOnline
 */
exports.getLinesStatusOnline = getLinesStatusOnline;
