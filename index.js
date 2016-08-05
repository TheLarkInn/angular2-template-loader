// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl *:(.*)$/gm;
var stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;
var requireRegex = /(require\(.+?\))/g;

function replaceStringsWithRequires(string) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== ".") {
      url = "./" + url;
    }
    return "require('" + url + "')";
  });
}

function addToString(string){
  return string.replace(requireRegex, function(match) {
    return match + ".toString()";
  })
}

module.exports = function(source, sourcemap) {
  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  var newSource = source.replace(templateUrlRegex, function (match, url) {
                 // replace: templateUrl: './path/to/template.html'
                 // with: template: require('./path/to/template.html')
                 return "template:" + replaceStringsWithRequires(url);
               })
               .replace(stylesRegex, function (match, urls) {
                 // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
                 // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
                 return "styles:" + addToString(replaceStringsWithRequires(urls));
               });

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap)
  } else {
    return newSource;
  }
};
