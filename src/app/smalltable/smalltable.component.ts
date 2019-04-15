import {Component, ElementRef, Input, OnInit, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-smalltable',
  templateUrl: './smalltable.component.html',
  styleUrls: ['./smalltable.component.css']
})
export class SmalltableComponent implements OnInit {
  @Input() tableHeadFromFather;
  @Input() tableContentFromFather;

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
  }

}
