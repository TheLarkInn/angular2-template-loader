var componentWithTemplateUrlAsLastDecoratorField = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    templateUrl: 'file.html'
  })
  export class TestComponent {}
`;

module.exports = componentWithTemplateUrlAsLastDecoratorField;
