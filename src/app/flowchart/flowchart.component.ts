import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {User} from '../models/user';
import {NgModel} from '@angular/forms';
import {TranslateService} from 'ng2-translate';
import {TaskService} from '../service/taskService';

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit {

  pageNum: number;
  productName: any;
  questionItem: any;
  sampleAnswerList: any;
  chooseItem: number;
  formItem: any;
  currentType: string;
  currentTaskId: number;
  pointItem: any;
  templateId: number;
  @ViewChild('firstRow') firstRow: ElementRef;
  @ViewChild('secondRow') secondRow: ElementRef;
  @ViewChild('materialFlow') materialFlow: ElementRef;

  constructor(public user: User, private taskService: TaskService, private renderer: Renderer2, private translate: TranslateService) {
    this.user.mainShowing = false;
    this.pageNum = 0;
    this.templateId = 0;
    this.questionItem = {
    };
    this.formItem = {};
  }

  ngOnInit() {
    // get templateId
    this.taskService.getTemplate().subscribe( data => {
      // @ts-ignore
      const bodyJson = JSON.parse(data._body);
      if (bodyJson.hasOwnProperty('_embedded')) {
        // @ts-ignore
        const templateList = bodyJson._embedded.templates;
        this.templateId = templateList[templateList.length - 1].template.processTemplateId;
      } else {
        // @ts-ignore
        this.templateId = 0;
      }
    });
  }

  startFlowchart() {
    const param = {
      'name': this.user.username + '_process',
      'templateId': this.templateId
    };
    this.taskService.createProcess(param).subscribe(data => {
      // @ts-ignore
      const bodyJson = JSON.parse(data._body);
      if (bodyJson.length > 0) {
        this.pointItem = bodyJson[0];
        console.log(this.pointItem);
        this.currentType = this.pointItem.config[0].value;

        this.pageNum ++;
        console.log(JSON.stringify(this.pointItem));
      }
    });
  }

  goToNextStep() {
    const param: { [key: string]: string; } = {};
    for (const item of this.pointItem.form) {
      param[item.id] = item.value;
    }
    // 点击下一步时生成当前步的图形并显示
    this.generateImage(this.pointItem.form[0].value, this.pointItem.config[1].value, this.pointItem.config[2].value);
    this.taskService.completeTask(this.pointItem.id, param).subscribe( data => {
      if (data.status === 200) {
        // @ts-ignore
        const bodyJson = JSON.parse(data._body);
        if (bodyJson.length > 0) {
          this.pointItem = bodyJson[0];
          console.log(this.pointItem);
          this.currentType = this.pointItem.config[0].value;
          console.log(JSON.stringify(this.pointItem));
        }
      }
    });
  }
  generateImage(content, imgName, rowNum) {
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText(content);
    this.renderer.appendChild(div, text);
    this.renderer.addClass(div, 'img-div');
    this.renderer.setStyle(div, 'background-image',
      'url("../../assets/flowchart/' + imgName + '.png")');
    switch (rowNum) {
      case '1':
        this.renderer.setStyle(div, 'margin-left', '500px');
        this.renderer.appendChild(this.firstRow.nativeElement, div);
        break;
      case '2':
        this.renderer.setStyle(div, 'margin-left', '500px');
        this.renderer.appendChild(this.secondRow.nativeElement, div);
        break;
      case '4':
        this.renderer.appendChild(this.materialFlow.nativeElement, div);
    }
  }

  goToNextPage() {
    this.pageNum ++;
  }

}
