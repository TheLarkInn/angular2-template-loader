var componentWithCommentAfterTemplateUrl = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    templateUrl: './some/path/to/file.html' /*my awesome template*/
  })
  export class TestComponent {}
`;

module.exports = componentWithCommentAfterTemplateUrl;
