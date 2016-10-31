var utils = require('loader-utils');
var assign = require('object-assign');
// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl *:(.*)$/gm;
var stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string, config) {
  // Defaults type assertion inclusion <string> to false for now
  var typeAssertion = config.hasOwnProperty('typeAssertion') ? config.typeAssertion : false;

  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== ".") {
      url = "./" + url;
    }
    return (typeAssertion ? "<string>" : "") + "require('" + url + "')";
  });
}

/**
 * Loads loader config. Reads config from both query string
 * and new webpack2 loader options. Query takes precedence.
 */
function getConfig(ctx) {

  var query = ctx.query ? utils.parseQuery(ctx.query) : {};
  var options = ctx.options ? ctx.options['angular2Template'] : {};

  delete query.config;

  return assign({}, options, query);
}

module.exports = function(source, sourcemap) {
  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  // Reads config
  var config = getConfig(this);

  var newSource = source.replace(templateUrlRegex, function (match, url) {
                 // replace: templateUrl: './path/to/template.html'
                 // with: template: require('./path/to/template.html')
                 return "template:" + replaceStringsWithRequires(url, config);
               })
               .replace(stylesRegex, function (match, urls) {
                 // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
                 // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
                 return "styles:" + replaceStringsWithRequires(urls, config);
               });

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap)
  } else {
    return newSource;
  }
};
