var componentWithSingleLineDecorator = `
  import {Component} from '@angular/core';

  @Component({selector: 'test-component', templateUrl: './file.html', styleUrls: ['./styles.css']})
  export class TestComponent {};
`;

module.exports = componentWithSingleLineDecorator;
