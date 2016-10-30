// using: regex, capture groups, and capture group variables.
const componentRegex = /@(Component)\({([\s\S]*)}\)$/gm;
const templateUrlRegex = /templateUrl\s*:(.*)/g;
const styleUrlsRegex = /styleUrls\s*:(\s*\[[\s\S]*?\])/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== '.') {
      url = './' + url;
    }
    return "require('" + url + "')";
  });
}

module.exports = function (source, sourcemap) {
  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  source = source.replace(componentRegex, function (match, decorator, metadata) {
    metadata = metadata
      .replace(templateUrlRegex, function (match, url) {
        // replace: templateUrl: './path/to/template.html'
        // with: template: require('./path/to/template.html')
        return 'template:' + replaceStringsWithRequires(url);
      })
      .replace(styleUrlsRegex, function (match, urls) {
        // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
        // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
        return 'styles:' + replaceStringsWithRequires(urls);
      });

    return '@' + decorator + '({' + metadata + '})';
  });

  // Support for tests
  if (this.callback) {
    this.callback(null, source, sourcemap)
  } else {
    return source;
  }
};
