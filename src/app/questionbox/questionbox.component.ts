import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-questionbox',
  templateUrl: './questionbox.component.html',
  styleUrls: ['./questionbox.component.css']
})
export class QuestionboxComponent implements OnInit {

  @Input() questionFromFather;
  @Input() answerFromFather;
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
    // show the selected radio
    if (this.answerFromFather.length > 0) {
      for (const item of this.answerFromFather) {
        if (item.question.questionId === this.questionItem.questionId) {
          this.chooseItem = item.options[0].optionId;
        }
      }
    }
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
    let value = 0;
    for ( const item of this.questionItem.answer.options) {
      if (item.optionId.toString() === optionId.toString()) {
        value = item.value;
        break;
      }
    }
    this.answerFromChild.emit(
      {
        'options': [
          {
            'optionId': this.chooseItem
          }
        ],
        'question': {
          'questionId': this.questionItem.questionId
        },
        'point': {
          'score': this.questionItem.weight * value,
          'totalScore': this.questionItem.weight * this.questionItem.answer.value,
        }
      });
  }

}
