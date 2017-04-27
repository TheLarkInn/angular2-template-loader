var componentWithTemplateUrlLast = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    styleUrls: ['./app/css/styles.css'],
    templateUrl: './some/path/to/file.html'
  })
  export class TestComponent {}
`;

module.exports = componentWithTemplateUrlLast;
