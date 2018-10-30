import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-questionbox',
  templateUrl: './questionbox.component.html',
  styleUrls: ['./questionbox.component.css']
})
export class QuestionboxComponent implements OnInit {

  @Input() questionFromFather;
  @Output() answerFromChild = new EventEmitter();

  questionItem: any;
  questionName: string;
  chooseItem: number;
  comment: string;
  commentShowing: boolean;

  constructor() { }

  ngOnInit() {
    this.questionItem = this.questionFromFather;
    this.questionName = this.questionItem.name;
    this.comment = '';
    for ( let i = 0; i < this.questionItem.comments.length; i ++) {
      if (this.questionItem.comments[i].detail !== null ) {
        this.comment = this.comment + this.questionItem.comments[i].detail + '; ' ;
      }
    }
    if (this.comment === '') {
      this.commentShowing = false;
    } else {
      this.commentShowing = true;
    }
  }

  chooseItemChange(optionId: number) {
    this.chooseItem = optionId;
    this.answerFromChild.emit(
      {'options': [
          {
            'optionId': this.chooseItem
          }
        ],
      'question': {
        'questionId': this.questionItem.questionId
      }});
  }

}
