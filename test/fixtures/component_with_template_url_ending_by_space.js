var componentWithTemplateUrlEndingBySpace = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    templateUrl: './some/path/to/file.html', 
    styleUrls: ['./app/css/styles.css'] 
  })
  export class TestComponent {}
`;

module.exports = componentWithTemplateUrlEndingBySpace;
