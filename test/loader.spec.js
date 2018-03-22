var should = require("should");
var loader = require("../index.js");

var fixtures = require("./fixtures");

function getNewLoaderContext() {
  return {
    version: 2,
    context: "",
    request: "",
    // query: any;
    // callback: loaderCallback;
    async: function(){ },
    cacheable: function (flag) { },
    loaders: ["angular2-template-loader"],
    loaderIndex: 0,
    resource: "",
    resourcePath: "",
    resourceQuery: "",
    emitWarning: function(message) { },
    emitError: function(message) { },
    resolve: function(context, request, callback) { },
    addDependency: function(file) { },
    dependency: function(file) { },
    dependency: function(file) { },
    dependency: function(file) { },
    dependency: function(file) { },
    addContextDependency: function(directory) { },
    clearDependencies: function() { },
    sourceMap: true,
    target: "",
    webpack: true,
    emitFile: function(name, content, sourceMap) {},
    // fs: any,
  }
}

describe("loader", function(){
  it("Should convert html and style file strings to require()s", function(){

    loader.call(getNewLoaderContext(), fixtures.simpleAngularTestComponentFileStringSimple)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('./some/path/to/file.html'),
    styles: [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
      )

  });

  it("Should convert html and style file strings to require()s regardless of inner quotes", function(){

    loader.call(getNewLoaderContext(), fixtures.componentWithQuoteInUrls)
      .should
      .be
      .eql(String.raw`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('./some/path/to/file\'.html'),
    styles: [require('./app/css/\"styles\".css\\')]
  })
  export class TestComponent {}
`
      )

  });

  it("Should convert html and multiple style file strings to require()s", function(){

    loader.call(getNewLoaderContext(), fixtures.componentWithMultipleStyles)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('./some/path/to/file.html'),
    styles: [
      require('./app/css/styles.css'),
      require('./app/css/more-styles.css')
    ]
  })
  export class TestComponent {}
`
      )

  });

  it("Should return original source if there are no matches", function() {
    loader.call(getNewLoaderContext(), 'foo')
      .should
      .be
      .eql('foo');
  });

  it("Should convert partial string match requires", function() {
    loader.call(getNewLoaderContext(), `{templateUrl: './index/app.html'}`)
      .should
      .be
      .eql(`{template: require('./index/app.html')}`);
  });

  it("Should handle the absense of proper relative path notation", function() {
    loader.call(getNewLoaderContext(), fixtures.componentWithoutRelPeriodSlash)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('./file.html'),
    styles: [require('./styles.css')]
  })
  export class TestComponent {}
`
      );
  });

  it("Should convert html and style file strings to require()s regardless of spacing", function(){

    loader.call(getNewLoaderContext(), fixtures.componentWithSpacing)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    template: require('./some/path/to/file.html'),
    styles: [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
      )

  });

  it("Should keep templateUrl when asked using loader query", function () {
    var context = getNewLoaderContext();
    context.query = '?keepUrl=true';
    loader.call(context, fixtures.componentWithSpacing)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    templateUrl: require('./some/path/to/file.html'),
    styleUrls: [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
      );

  });

  it("Should keep templateUrl when asked using loader options", function () {
    var context = getNewLoaderContext();
    context.query = { keepUrl: true };
    loader.call(context, fixtures.componentWithSpacing)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    templateUrl: require('./some/path/to/file.html'),
    styleUrls: [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
      );

  });

  it("Should convert html and style file strings to require()s in a single line component decorator", function() {

    loader.call(getNewLoaderContext(), fixtures.componentWithSingleLineDecorator)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({selector: 'test-component', template: require('./file.html'), styles: [require('./styles.css')]})
  export class TestComponent {};
`
      );

  });

  it("Should convert html and style file strings to require()s if line is ending by space character", function() {

    loader.call(getNewLoaderContext(), fixtures.componentWithTemplateUrlEndingBySpace)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('./some/path/to/file.html'), 
    styles: [require('./app/css/styles.css')] 
  })
  export class TestComponent {}
`
      )

  });

});
