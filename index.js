module.exports = function(source) {
  // using: regex, capture groups, and capture group variables.
  var templateUrlRegex = new RegExp(/templateUrl:\s*['"](.*?)['"]/gm)
  var stylesRegex = new RegExp(/styleUrls:(.*)/)

  // replace: templateUrl: './path/to/template.html'
  // with: template: require('./path/to/template.html')
  function replaceHTMLTemplatePathWithRequire(source) {
    if (templateUrlRegex.test(source)) {
      var newSource = source.replace(templateUrlRegex, "template: require('$1')");
      return newSource;
    }

    return source;
  }

  // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
  // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
  function replaceStylesheetPathWithRequire(source) {
    var stylesMatch = source.match(stylesRegex);
    var styles;

    if ( stylesRegex.test(source) ) {
      styles = stylesMatch[0]
                .replace(/['"](.*?)['"]/g, "require('$1')")
                .replace(/styleUrls/g, 'styles');

      var newSource = source.replace(stylesRegex, styles);
      return newSource;
    }

    return source;
  }

  return replaceStylesheetPathWithRequire(replaceHTMLTemplatePathWithRequire(source));
}
