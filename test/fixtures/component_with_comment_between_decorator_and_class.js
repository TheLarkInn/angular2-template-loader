var componentWithCommentBetweenDecoratorAndClass = `
  import {Component} from '@angular/core';

  @Component({
    selector: 'test-component',
    templateUrl: './some/path/to/file.html',
    styleUrls : ['./app/css/styles.css']
  })

  /*  
   * Comment
   */
  export class TestComponent  { }
`;

module.exports = componentWithCommentBetweenDecoratorAndClass;
