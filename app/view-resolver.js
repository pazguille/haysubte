/**
 * Module dependencies
 */
const pug = require('pug');

/**
 * Template View Resolver
 */
class ViewResolver {
  constructor(path) {
    this._template = pug.compileFile(
      path,
      { cache: true }
    );
  }

  render(locals, res) {
    const html = this._template(locals);
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.write(html);
    res.end();
  }
}

/**
 * Expose ViewResolver
 */
module.exports = ViewResolver;
