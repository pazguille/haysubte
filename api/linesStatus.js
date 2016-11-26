/**
 * Module dependencies
 */
const { StaticScraper } = require('scraperjs');

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
  return response;
}

/**
 * getLinesStatus
 */
function getLinesStatus() {
  return StaticScraper.create('http://www.metrovias.com.ar/')
    .scrape(scrapLinesStatus);
}

/**
 * Expose getLinesStatus
 */
module.exports = getLinesStatus;
