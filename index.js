var loaderUtils = require("loader-utils");
var ts = require("typescript");

function calculateTemplateUrlReplacement(propertyAssignment, replacedPropertyName) {
  return [
    {
      start: propertyAssignment.name.getStart(),
      end: propertyAssignment.name.getEnd(),
      replacement: replacedPropertyName
    },
    constructUrlReplacement(propertyAssignment.initializer)
  ];
}

function calculateStyleUrlsReplacement(propertyAssignment, replacedPropertyName) {
  var styleUrlsReplacements = [];
  for (var i = 0; i < propertyAssignment.initializer.elements.length; i++) {
    styleUrlsReplacements.push(constructUrlReplacement(propertyAssignment.initializer.elements[i]));
  }
  return [
    {
      start: propertyAssignment.name.getStart(),
      end: propertyAssignment.name.getEnd(),
      replacement: replacedPropertyName
    }
  ].concat(styleUrlsReplacements);
}

function constructUrlReplacement(element) {
  var delimiter = "'";
  if (element.kind === ts.SyntaxKind.FirstTemplateToken) {
    delimiter = "`";
  }
  var url = element.text.replace(/(['"\\])/g, "\\$&");
  if (url.charAt(0) !== ".") {
    url = "./" + url;
  }

  return {
    start: element.getStart(),
    end: element.getEnd(),
    replacement: "require(" + delimiter + url + delimiter + ")"
  };
}

function isTemplateUrlProperty(propertyAssignment) {
  return (
    propertyAssignment.name.kind === ts.SyntaxKind.Identifier &&
    propertyAssignment.name.text === "templateUrl" &&
    (propertyAssignment.initializer.kind === ts.SyntaxKind.StringLiteral ||
      propertyAssignment.initializer.kind === ts.SyntaxKind.FirstTemplateToken)
  );
}

function isStyleUrlsPropery(propertyAssignment) {
  return (
    propertyAssignment.name.kind === ts.SyntaxKind.Identifier &&
    propertyAssignment.name.text === "styleUrls" &&
    propertyAssignment.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression &&
    propertyAssignment.initializer.elements.every(function(element) {
      return (
        element.kind === ts.SyntaxKind.StringLiteral ||
        element.kind === ts.SyntaxKind.FirstTemplateToken
      );
    })
  );
}

function flatten(prev, current) {
  return prev.concat(current);
}

function findeReplacements(node, templateReplacement, styleReplacement) {
  var positions = [];

  calculateReplacements(node);

  function calculateReplacements(node) {
    switch (node.kind) {
      // search only for class declarations
      case ts.SyntaxKind.ClassDeclaration:
        if (node.decorators && node.decorators.length > 0) {
          // filter for all decorators containing a component decorator
          var replacementPositions = node.decorators
            .filter(function(decorator) {
              return (
                decorator.expression.kind === ts.SyntaxKind.CallExpression &&
                decorator.expression.expression.kind === ts.SyntaxKind.Identifier &&
                decorator.expression.expression.text === "Component" &&
                decorator.expression.arguments.length > 0
              );
            })
            .map(function(decorator) {
              return decorator.expression.arguments[0];
            })
            // the argument must be a literal expression
            .filter(function(argument) {
              return (argument.kind = ts.SyntaxKind.ObjectLiteralExpression);
            })
            .map(function(literalExpression) {
              return literalExpression.properties;
            })
            .reduce(flatten, [])
            // filter for property assignments
            .filter(function(properties) {
              return properties.kind === ts.SyntaxKind.PropertyAssignment;
            })
            // only filter for property assignments with the text templateUrl or styleUrls
            .filter(function(propertyAssignment) {
              return (
                isTemplateUrlProperty(propertyAssignment) || isStyleUrlsPropery(propertyAssignment)
              );
            })
            .map(function(propertyAssignment) {
              if (propertyAssignment.name.text === "templateUrl") {
                return calculateTemplateUrlReplacement(propertyAssignment, templateReplacement);
              } else {
                return calculateStyleUrlsReplacement(propertyAssignment, styleReplacement);
              }
            })
            .reduce(flatten, []);
          positions = positions.concat(replacementPositions);
        }
        break;
    }

    return ts.forEachChild(node, calculateReplacements);
  }

  return positions;
}

module.exports = function(source, sourcemap) {
  var config = {};
  var query = loaderUtils.parseQuery(this.query);
  var styleProperty = "styles";
  var templateProperty = "template";

  if (this.options != null) {
    Object.assign(config, this.options["angular2TemplateLoader"]);
  }

  Object.assign(config, query);

  if (config.keepUrl === true) {
    styleProperty = "styleUrls";
    templateProperty = "templateUrl";
  }

  // Not cacheable during unit tests;
  this.cacheable && this.cacheable();

  var fileName = this.resourcePath;

  var sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.ES6,
    /*setParentNodes */ true
  );

  var positions = findeReplacements(sourceFile, templateProperty, styleProperty);

  var newSource = source;

  for (var i = positions.length - 1; i >= 0; i--) {
    var pos = positions[i];
    var prefix = newSource.substring(0, pos.start);
    var postfix = newSource.substring(pos.end);
    newSource = prefix + pos.replacement + postfix;
  }

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap);
  } else {
    return newSource;
  }
};
