/**
 * Module dependencies
 */
const https = require('https');
const cheerio = require('cheerio');

/**
 * Metro lines
 * 'P', 'U'
 */
const lines = ['A', 'B', 'C', 'D', 'E', 'H'];

/**
 * Scrap lines and built a response
 */
function scrapLinesStatus(html) {
  const status = {};
  const $ = cheerio.load(html);
  const linesNodes = $('.row');
  // const lastUpdate = $('.actualizacion').text().trim().toLowerCase();
  lines.forEach((key, index) => {
    const line = linesNodes.get(index);
    const text = $(line).text().trim().toLowerCase();
    status[key] = {
      text: text === 'normal' ? text : 'Con Problemas',
      status: text,
    };
  });
  return status;
}

/**
 * getLinesConnection
 */
function getLinesConnection() {
  return new Promise((resolve) => {
    let data = '';
    const req = https.request('https://aplicacioneswp.metrovias.com.ar/estadolineas/signalr/negotiate?clientProtocol=2.0&connectionData=%5B%7B%22name%22%3A%22moveshape%22%7D%5D', (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.end();
  });
}


/**
 * getLinesStatus
 */
function getLinesStatus() {
  return getLinesConnection()
    .then((connection) => {
      return new Promise((resolve) => {
        const req = https.request(`https://aplicacioneswp.metrovias.com.ar/estadolineas/signalr/connect?transport=serverSentEvents&clientProtocol=2.0&connectionData=%5B%7B%22name%22%3A%22moveshape%22%7D%5D&tid=7&connectionToken=${encodeURIComponent(connection.ConnectionToken)}`, (res) => {
          res.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.includes('"M":[{')) {
              req.destroy();
              const response = JSON.parse(data.replace('data: ', ''));
              resolve(scrapLinesStatus(response.M[0].A[0]));
            }
          });
        });
        req.end();
      });
    });
}

/**
 * Expose getLinesStatus
 */
module.exports = getLinesStatus;
