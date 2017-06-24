var should = require("should");
var loader = require("../index.js");

var fixtures = require("./fixtures");

describe("loader", function() {
  it("Should convert html and style file strings to require()s", function(){

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.simpleAngularTestComponentFileStringSimple)
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

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithQuoteInUrls)
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

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithMultipleStyles)
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
    loader.call({ resourcePath: '/path/file.ts' }, 'foo')
      .should
      .be
      .eql('foo');
  });

  it("Should not convert partial string match requires", function() {
    loader.call({ resourcePath: '/path/file.ts' }, `{templateUrl: './index/app.html'}`)
      .should
      .be
      .eql(`{templateUrl: './index/app.html'}`);
  });

  it("Should handle the absense of proper relative path notation", function() {
    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithoutRelPeriodSlash)
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

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithSpacing)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    template : require('./some/path/to/file.html'),
    styles : [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
      )

  });

  it("Should keep templateUrl when asked for", function () {

    loader.call({ resourcePath: '/path/file.ts', query: '?keepUrl=true'}, fixtures.componentWithSpacing)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    templateUrl : require('./some/path/to/file.html'),
    styleUrls : [require('./app/css/styles.css')]
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
    self.resourcePath = '/path/file.ts';

    loader.call(self, fixtures.componentWithSpacing)
        .should
        .be
        .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector : 'test-component',
    templateUrl : require('./some/path/to/file.html'),
    styleUrls : [require('./app/css/styles.css')]
  })
  export class TestComponent {}
`
        );

  });

  it("Should convert html and style file strings to require()s in a single line component decorator", function() {

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithSingleLineDecorator)
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

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithTemplateUrlEndingBySpace)
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

   it("Should convert html and style file template literals to require()s", function() {

    loader.call({ resourcePath: '/path/file.ts' }, fixtures.componentWithTemplateLiterals)
      .should
      .be
      .eql(`
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    template: require(\`./some/path/to/file.html\`),
    styles: [require(\`./app/css/styles.css\`)]
  })
  export class TestComponent {}
`
      )

  });

});
