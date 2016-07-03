var should = require("should");
var loader = require("../index.js");

var fixtures = require("./fixtures");

describe("loader", function() {
  it("Should convert html and style file strings to require()s", function(){

    loader.call({}, fixtures.simpleAngular2TestComponentFileStringSimple)
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
    loader.call({}, `templateUrl: './index/app.html'`)
      .should
      .be
      .eql(`template: require('./index/app.html')`);
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

});
