var should = require("should");
var loader = require("../index.js");

var fixtures = require("./fixtures");

describe("loader", function() {
  it("Should convert html and style file strings to require()s", function(){

    loader.call({}, fixtures.simpleAngularTestComponentFileStringSimple)
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

    loader.call({}, fixtures.componentWithQuoteInUrls)
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

    loader.call({}, fixtures.componentWithMultipleStyles)
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
    loader.call({}, 'foo')
      .should
      .be
      .eql('foo');
  });

  it("Should convert partial string match requires", function() {
    loader.call({}, `{templateUrl: './index/app.html'}`)
      .should
      .be
      .eql(`{template: require('./index/app.html')}`);
  });

  it("Should handle the absense of proper relative path notation", function() {
    loader.call({}, fixtures.componentWithoutRelPeriodSlash)
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

  it("Should not handle the absense of proper relative path notation if configured", function() {
    loader.call({query: '?keepNonRelative=true'}, fixtures.componentWithoutRelPeriodSlash)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require('file.html'),
    styles: [require('styles.css')]
  })
  export class TestComponent {}
`
      );
  });

  it("Should convert html and style file strings to require()s regardless of spacing", function(){

    loader.call({}, fixtures.componentWithSpacing)
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

  it("Should keep templateUrl when asked for", function () {

    loader.call({query: '?keepUrl=true'}, fixtures.componentWithSpacing)
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

  it("Should keep templateUrl when asked using options", function () {

    var self = {};

    self.options = {
      angular2TemplateLoader: {
        keepUrl: true
      }
    };

    loader.call(self, fixtures.componentWithSpacing)
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

    loader.call({}, fixtures.componentWithSingleLineDecorator)
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

    loader.call({}, fixtures.componentWithTemplateUrlEndingBySpace)
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
