var Promise = require('bluebird');
var loaderUtils = require('loader-utils');
var path = require('path');
// using: regex, capture groups, and capture group variables.
var templateUrlRegex = /templateUrl *:(.*)$/gm;
var stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
var stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;
var trailingSlashRegex = /[\\\/]$/;
var query = loaderUtils.parseQuery(this.query);


module.exports = function(source, sourcemap) {
  var loader = this;
  var rootPath = query.root || this.options.resolve && this.options.resolve.root;
  var TOKEN_INDEX = 0;
  var finalCallback = false;
  var replaceToken = function() {
    return "___" + String(TOKEN_INDEX) + "___";
  }

  var urlsToBeResolved = {};

  // Not cacheable during unit tests;
  loader.cacheable && loader.cacheable();

  // Tokenize whole template
  var newSource = source
    .replace(templateUrlRegex, function (match, url) {
      // replace: templateUrl: './path/to/template.html'
      // with: template: require('./path/to/template.html')
      debugger;
      return "template:" + tokenizeUrl(url);
    })
    .replace(stylesRegex, function (match, urls) {
      // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
      // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
      debugger;
      return "styles:" + tokenizeUrl(urls);
    });

  function replaceTokensWithResolvedModuleRequest(moduleRequest, moduleRequestToken) {
    return new Promise( function(resolveFn, rejectFn) {
      debugger;
      loader.resolve(loader.context, moduleRequest, function(error, filename) {
        if (error) {
          debugger;
          loader.callback(error);
          return;
        }

        // Mark module as a dependency for individual caching and dep. tracing
        loader.dependency && loader.dependency(path.normalize(filename));
        // async
         loader.loadModule(filename, function(error, data) {
          if (error) {
            debugger;
            loader.callback(error);
            return;
          }

          // Replace the tokenizedTemplate with real resolved data;
          newSource.replace(moduleRequestToken, data);
          debugger;
          resolveFn({moduleRequestToken, data})
        });
      });
    });
  }

  function tokenizeUrl(string) {
    return string.replace(stringRegex, function (match, quote, url) {
      // Sanitize url for canonical require format. IE: './path/to/file'
      if (url.charAt(0) !== ".") {
        url = "./" + url;
      }

      token = replaceToken()

      urlsToBeResolved[token] = loaderUtils.urlToRequest(url, rootPath);
      TOKEN_INDEX += 1;

      return token;
    });
  }

  Promise.all(
    Object.keys(urlsToBeResolved).map(function(key, index) {
      debugger;
      return replaceTokensWithResolvedModuleRequest(urlsToBeResolved[key], key);
    })
  ).then(function(resolveDataArray) {
    loader.callback && loader.callback(null, newSource, sourcemap);
  })
};


// var moduleRequest = loaderUtils.urlToRequest(filename, query.root);
// loaderContext.resolve(context, moduleRequest, function(err, filename) {
//       if(err) {
//         callback(err);
//         return;
//       }

//       loaderContext.dependency && loaderContext.dependency(filename);
//       // The default (asynchronous)
//       loaderContext.loadModule("-!" + __dirname + "/stringify.loader.js!" + filename, function(err, data) {
//         if(err) {
//           callback(err);
//           return;
//         }

//         callback(null, {
//           contents: JSON.parse(data),
//           filename: filename
//         });
//       });
//     });
//   };
