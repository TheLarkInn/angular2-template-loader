// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl:(.*)$/gm;
var stylesRegex = /styleUrls:(\s*\[[^\]]*?\])/g;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string) {
  return string.replace(stringRegex, "require('$2')");
}

module.exports = function(source) {
  return source.replace(templateUrlRegex, function (match, url) {
                 // replace: templateUrl: './path/to/template.html'
                 // with: template: require('./path/to/template.html')
                 return "template:" + replaceStringsWithRequires(url);
               })
               .replace(stylesRegex, function (match, urls) {
                 // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
                 // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
                 return "styles:" + replaceStringsWithRequires(urls);
               });
};
