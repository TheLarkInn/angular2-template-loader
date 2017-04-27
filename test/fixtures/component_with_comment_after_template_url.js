var componentWithCommentAfterTemplateUrl = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    templateUrl: './some/path/to/file.html', /*my awesome template*/
    styleUrls: ['./app/css/styles.css']
  })
  export class TestComponent {}
`;

module.exports = componentWithCommentAfterTemplateUrl;
