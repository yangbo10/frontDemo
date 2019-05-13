import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {User} from '../models/user';
import {TranslateService} from 'ng2-translate';
import {TaskService} from '../service/taskService';
import {SmalltableComponent} from '../smalltable/smalltable.component';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

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
  chooseItem: string;
  formItem: any;
  currentType: string;
  currentTaskId: number;
  pointItem: any;
  templateId: number;
  questionDone: boolean;
  materialPointList: any;
  selectedPointId: string;
  selectedSecondPointId: string;
  lineList: any;
  rectList: any;
  controlPointId: string;
  lastPointItem: any;
  inputFilled: boolean;
  kanbanList: any;
  rectBlueList: any;
  buttonDisabled: boolean;
  @ViewChild('firstRow') firstRow: ElementRef;
  @ViewChild('secondRow') secondRow: ElementRef;
  @ViewChild('thirdRow') thirdRow: ElementRef;
  @ViewChild('smallImgRow') smallImgRow: ElementRef;
  @ViewChild('materialFlow') materialFlow: ElementRef;
  smalltableComponentFactory: ComponentFactory<SmalltableComponent>;

  constructor(public user: User, private taskService: TaskService, private renderer: Renderer2,
              private translate: TranslateService,
              public viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver,
              public elementRef: ElementRef, private router: Router) {
    this.user.mainShowing = false;
    this.pageNum = 0;
    this.templateId = 0;
    this.questionDone = false;
    this.inputFilled = false;
    this.questionItem = {
    };
    this.formItem = {};
    this.materialPointList = [];
    this.selectedPointId = '';
    this.selectedSecondPointId = '';
    this.controlPointId = '';
    this.lineList = [];
    this.rectList = [];
    this.kanbanList = [];
    this.rectBlueList = [];
    this.buttonDisabled = false;
  }

  ngOnInit() {
    this.initItems();
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
    this.smalltableComponentFactory = this.componentFactoryResolver.resolveComponentFactory(SmalltableComponent);
  }

  initItems() {
    this.pageNum = 0;
    this.templateId = 0;
    this.questionDone = false;
    this.inputFilled = false;
    this.questionItem = {
    };
    this.formItem = {};
    this.materialPointList = [];
    this.selectedPointId = '';
    this.selectedSecondPointId = '';
    this.controlPointId = '';
    this.lineList = [];
    this.rectList = [];
    this.kanbanList = [];
    this.rectBlueList = [];
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
        // console.log(this.pointItem);
        this.currentType = this.pointItem.config[0].value;

        this.pageNum ++;
        // console.log(JSON.stringify(this.pointItem));
      }
    }, error => {
      console.log('error msg:', error.status);
      if (error.status === 401) {
        // @ts-ignore
        Swal.fire({
          title: '登录信息过期，请重新登陆获取鉴权。',
          type: 'error',
          showConfirmButton: true,
          timer: 3000
        });
      } else {
        // @ts-ignore
        Swal.fire({
          title: '网络连接错误。',
          type: 'error',
          showConfirmButton: true,
          timer: 3000
        });
      }
    });
  }

  goToNextStep() {
    //防止重复点击
    this.buttonDisabled = true;
    const param: { [key: string]: string; } = {};
    for (const item of this.pointItem.form) {
      param[item.id] = item.value;
    }

    // 点击下一步时生成当前步的图形并显示
    switch (this.pointItem.config[0].value) {
      case 'form':
        this.inputFilled = true;
        for (const item of this.pointItem.form) {
          if ( item.value === null || item.value.trim() === '') {
            this.inputFilled = false;
          }
        }
        if (!this.inputFilled) {
          // @ts-ignore
          Swal.fire({
            title: '请填写所有内容，不得为空。',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
          break;
        }
        if (this.pointItem.form.length === 1) {
          // form
          this.generateImage(this.pointItem.form[0].value, this.pointItem.config[1].value,
            this.pointItem.config[2].value, this.pointItem.id);
          this.questionDone = true;
        } else {
          // form - table
          this.generateTable(this.pointItem.form, this.pointItem.id);
          this.questionDone = true;
        }
        break;
      case 'question':
        // question
        for (const item of this.pointItem.choice.question.answer.options) {
          if (this.pointItem.form[1].value === item.optionId) {
            if (item.icon != null) {
              this.generateImage('-', item.icon, this.pointItem.config[1].value, this.pointItem.id);
            }
            this.questionDone = true;
            break;
          }
        }
        break;
      case 'image':
        if (this.materialPointList.indexOf(this.selectedPointId) < 0) {
          // @ts-ignore
          Swal.fire({
            title: '请在物料流上点击选择一个节点',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        } else {
          this.generateImage('-', this.pointItem.config[1].value, this.pointItem.config[2].value, this.pointItem.id);
          this.questionDone = true;
        }
        break;
      case 'line':
        this.inputFilled = true;
        for (const item of this.pointItem.form) {
          if (item.writable && (item.value === null || item.value.trim() === '')) {
            this.inputFilled = false;
          }
        }
        if (!this.inputFilled) {
          // @ts-ignore
          Swal.fire({
            title: '请填写内容，不得为空。',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
          break;
        }
        if (this.pointItem.config[1].value === 'connection-kanban') {
          console.log ('start:' + this.selectedPointId);
          console.log ('end:' + this.selectedSecondPointId);
          // 看板回流信息需要设置开始节点和结束节点
          if  (this.materialPointList.indexOf(this.selectedPointId) < 0) {
            // @ts-ignore
            Swal.fire({
              title: '请在物料流上点击选择开始节点',
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          } else if (this.materialPointList.indexOf(this.selectedSecondPointId) < 0) {
            // @ts-ignore
            Swal.fire({
              title: '请在物料流上点击选择结束节点',
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          } else {
            this.pointItem.form[0].value = this.selectedPointId;
            this.pointItem.form[1].value = this.selectedSecondPointId;
            this.generateKanban( this.pointItem.form[0].value, this.pointItem.form[1].value);
            this.questionDone = true;
          }
        } else {
          // 其他信息流只需要设置结束节点，开始节点为固定值
          if (this.materialPointList.indexOf(this.selectedPointId) < 0) {
            // @ts-ignore
            Swal.fire({
              title: '请在物料流上点击选择一个节点',
              type: 'error',
              showConfirmButton: true,
              timer: 3000
            });
          } else {
            this.pointItem.form[0].value = this.controlPointId;
            this.pointItem.form[1].value = this.selectedPointId;
            if (this.pointItem.form.length === 3) {
              this.generateLine(this.pointItem.form[2].value, this.pointItem.form[0].value,
                this.pointItem.form[1].value, this.pointItem.config[1].value);
            } else if (this.pointItem.form.length === 2) {
              this.generateLine('', this.pointItem.form[0].value,
                this.pointItem.form[1].value, this.pointItem.config[1].value);
            }
            this.questionDone = true;
          }
        }
        break;
      case 'text':
        break;
      case 'highlight':
        if (this.materialPointList.indexOf(this.selectedPointId) < 0) {
          // @ts-ignore
          Swal.fire({
            title: '请在物料流上点击选择一个节点',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        } else {
          this.pointItem.form[0].value = this.selectedPointId;
          this.generateHighlight(this.pointItem.form[0].value);
          this.questionDone = true;
        }
        break;
      default:
        break;
    }
    //复原button
    this.buttonDisabled = false;

    if (this.questionDone) {
      // 当前选择ID归零
      this.selectedPointId = '';
      this.selectedSecondPointId = '';
      this.lastPointItem = this.pointItem;
      this.taskService.completeTask(this.pointItem.id, param).subscribe( data => {
        if (data.status === 200) {
          // @ts-ignore
          const bodyJson = JSON.parse(data._body);
          if (bodyJson.length > 0) {
            this.pointItem = bodyJson[0];
            this.currentType = this.pointItem.config[0].value;
            const configLength = this.pointItem.config.length;
            console.log(this.currentType);
            console.log(this.pointItem.config[configLength - 1]);
            // console.log(JSON.stringify(this.pointItem));
          } else {
            this.currentType = 'flowchartEnd';
          }
          this.questionDone = false;
        }
      }, error => {
        console.log('error msg:', error.status);
        if (error.status === 401) {
          // @ts-ignore
          Swal.fire({
            title: '登录信息过期，请重新登陆获取鉴权。',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        } else {
          // @ts-ignore
          Swal.fire({
            title: '网络连接错误。',
            type: 'error',
            showConfirmButton: true,
            timer: 3000
          });
        }
      });
    }
  }
  generateImage(content, imgName, rowNum, pointId) {
    console.log(content);
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText(content);
    this.renderer.appendChild(div, text);
    this.renderer.setStyle(div, 'background-image',
      'url("../../assets/flowchart/' + imgName + '.png")');
    this.renderer.setAttribute(div, 'id', pointId);
    // 计算出小图标的X轴位置
    let smallImgX = (this.materialPointList.indexOf(this.selectedPointId) * 100).toString() + 'px';
    if (imgName === 'question-leveling') {
      smallImgX = (this.materialPointList.indexOf(this.selectedPointId) * 100 + 50).toString() + 'px';
    }
    switch (rowNum) {
      case '1':
        this.renderer.addClass(div, 'img-div');
        this.renderer.setStyle(div, 'margin-left', '500px');
        this.renderer.addClass(div, 'text-length');
        this.renderer.appendChild(this.firstRow.nativeElement, div);
        break;
      case '2':
        this.renderer.addClass(div, 'img-div');
        this.renderer.setStyle(div, 'margin-left', '500px');
        this.renderer.appendChild(this.secondRow.nativeElement, div);
        this.controlPointId = pointId;
        break;
      case '3':
        this.renderer.addClass(div, 'img-small-div');
        this.renderer.setStyle(div, 'margin-left', smallImgX);
        console.log('small img position: ', smallImgX);
        this.renderer.appendChild(this.smallImgRow.nativeElement, div);
        break;
      case '4':
        this.renderer.addClass(div, 'img-div');
        if (this.pointItem.name === '挑选一种原材料，跟随它的加工旅程') {
          // 物料流第一个节点抬高
          this.renderer.addClass(div, 'img-div-start-end');
        }
        if (this.materialPointList.length === 1) {
          // 物料流第二个节点旋转
          this.renderer.addClass(div, 'img-div-rotate');
          this.renderer.setStyle(div, 'margin-left', '100px');
          this.renderer.setStyle(div, 'background-image',
            'url("../../assets/flowchart/' + imgName + '-start' + '.png")');
        }
        if (this.materialPointList.length === 2) {
          // 物料流第三个节点位置fix
          this.renderer.setStyle(div, 'margin-left', '200px');
        }
        if (this.lastPointItem.name === '成品通过什么方式发给客户？') {
          // 物料流倒数第二个节点旋转
          this.renderer.addClass(div, 'img-div-rotate');
          this.renderer.setStyle(div, 'background-image',
            'url("../../assets/flowchart/' + imgName + '-end' + '.png")');
        }
        if (this.pointItem.name === '输入客户信息') {
          // 物料流最后一个节点抬高
          this.renderer.addClass(div, 'img-div-start-end');
          this.renderer.setStyle(div, 'margin-left', '100px');
        }
        if (imgName === 'form-inventory') {
          this.renderer.setStyle(div, 'line-height', '13');
        }
        this.renderer.appendChild(this.materialFlow.nativeElement, div);
        this.materialPointList.push(pointId);
        document.getElementById(pointId).addEventListener('click',
          () => {
            // @ts-ignore
            Swal.fire({
              title: '选择的节点：' + pointId,
              type: 'success',
              showConfirmButton: true,
              timer: 3000
            });
            if (this.selectedPointId !== '' && this.pointItem.config[1].value === 'connection-kanban') {
              // 看板回流这题如果已经存在了一个已选节点，则给第二个已选节点赋值
              this.selectedSecondPointId = pointId;
            } else {
              this.selectedPointId = pointId;
            }
          }, null);
        break;
      default:
        this.renderer.addClass(div, 'img-div');
        break;
    }
    console.log(this.materialPointList);
  }


  generateTable(contentList, pointId) {
    let thead = '';
    if (contentList.length > 0) {
      thead = contentList[0].value;
    }
    contentList.shift();
    const componentRef = this.viewContainerRef.createComponent(this.smalltableComponentFactory);
    componentRef.injector.get(SmalltableComponent).tableHeadFromFather = thead;
    componentRef.injector.get(SmalltableComponent).tableContentFromFather = contentList;
    const div = this.renderer.createElement('div');
    this.renderer.appendChild(div, componentRef.injector.get(SmalltableComponent).elementRef.nativeElement);
    this.renderer.addClass(div, 'table-div');
    this.renderer.setAttribute(div, 'id', pointId);
    this.renderer.appendChild(this.materialFlow.nativeElement, div);
    document.getElementById(pointId).addEventListener('click',
      () => {
        // @ts-ignore
        Swal.fire({
          title: '选择的节点：' + pointId,
          type: 'success',
          showConfirmButton: true,
          timer: 3000
        });
        if (this.selectedPointId !== '' && this.pointItem.config[1].value === 'connection-kanban') {
          // 看板回流这题如果已经存在了一个已选节点，则给第二个已选节点赋值
          this.selectedSecondPointId = pointId;
        } else {
          this.selectedPointId = pointId;
        }
      }, null);
    this.materialPointList.push(pointId);
  }

  generateLine(content, start, end, style) {
    let hasRect = false;
    const positionEndNum = this.materialPointList.indexOf(end);
    const positionStartNum = this.materialPointList.indexOf(start);
    if (content !== '') {
      hasRect = true;
    }
    const positionStart = {
      'x': 550,
      'y': 0
    };
    const positionEnd = {
      'x': 50 + 100 * positionEndNum,
      'y': 230
    };
    let polylineItem = {
      'x1': positionStart.x,
      'y1': positionStart.y,
      'x2': (positionStart.x + positionEnd.x) * 0.5,
      'y2': (positionStart.y + positionEnd.y) * 0.5 + 15,
      'x3': (positionStart.x + positionEnd.x) * 0.5,
      'y3': (positionStart.y + positionEnd.y) * 0.5 - 15,
      'x4': positionEnd.x,
      'y4': positionEnd.y
    };
    if (positionEndNum === 0) {
      // 客户如何下订单给工厂
      polylineItem = {
        'x1': positionStart.x,
        'y1': positionStart.y,
        'x2': (positionStart.x + positionEnd.x + 70) * 0.5,
        'y2': (positionStart.y + positionEnd.y - 100) * 0.5 + 15,
        'x3': (positionStart.x + positionEnd.x + 70) * 0.5,
        'y3': (positionStart.y + positionEnd.y - 100) * 0.5 - 15,
        'x4': positionEnd.x + 70,
        'y4': positionEnd.y - 100
      };
    }
    if (positionEndNum === this.materialPointList.length - 1) {
      // 物料流最后一题，线段方向反转
      polylineItem = {
        'x4': positionStart.x + 10,
        'y4': positionStart.y + 5,
        'x3': (positionStart.x + positionEnd.x - 45) * 0.5,
        'y3': (positionStart.y + positionEnd.y - 100) * 0.5 + 15,
        'x2': (positionStart.x + positionEnd.x - 45) * 0.5,
        'y2': (positionStart.y + positionEnd.y - 100) * 0.5 - 15,
        'x1': positionEnd.x - 55,
        'y1': positionEnd.y - 105
      };
    }
    const axisItem = polylineItem.x1 + ',' + polylineItem.y1 + ',' + polylineItem.x2 + ',' + polylineItem.y2 + ','
      + polylineItem.x3 + ',' + polylineItem.y3 + ',' + polylineItem.x4 + ',' + polylineItem.y4;
    if (hasRect) {
      const rectItem = {
        'rectX': positionEnd.x * 0.25 + 380,
        'rectY': (positionStart.y + positionEnd.y) * 0.5 - 60,
        'text': content,
        'width': 100,
        'height': 30
      };
      if (rectItem.text.length > 10) {
        rectItem.text = rectItem.text.substring(0, 9) + '...';
      }
      if (style === 'connection-manual') {
        rectItem.rectX = rectItem.rectX - 40;
        rectItem.rectY = rectItem.rectY - 15;
      }
      if (positionEndNum === this.materialPointList.length - 1) {
        rectItem.rectY = rectItem.rectY - 15;
      }
      this.rectList.push(rectItem);
    }
    this.lineList.push(axisItem);
    console.log(this.lineList);
  }

  generateKanban(start, end) {
    const positionEndNum = this.materialPointList.indexOf(end);
    const positionStartNum = this.materialPointList.indexOf(start);
    const positionStart = {
      'x': 50 + 100 * positionStartNum,
      'y': 230
    };
    const positionEnd = {
      'x': 50 + 100 * positionEndNum,
      'y': 230
    };
    const kanbanItem = {
      'x1': positionStart.x,
      'y1': positionStart.y,
      'x2': positionStart.x,
      'y2': positionStart.y - 50,
      'x3': positionEnd.x,
      'y3': positionEnd.y - 50,
      'x4': positionEnd.x,
      'y4': positionEnd.y
    };
    const axisItem = kanbanItem.x1 + ',' + kanbanItem.y1 + ',' + kanbanItem.x2 + ',' + kanbanItem.y2 + ','
      + kanbanItem.x3 + ',' + kanbanItem.y3 + ',' + kanbanItem.x4 + ',' + kanbanItem.y4;
    const rectItem = {
      'rectX': (positionStart.x + positionEnd.x) * 0.5 - 40,
      'rectY': (positionStart.y + positionEnd.y) * 0.5 - 68,
      'text': '',
      'width': 100,
      'height': 30
    };
    this.kanbanList.push(axisItem);
    this.rectBlueList.push(rectItem);
    console.log(this.kanbanList);
  }

  generateHighlight(pointId) {
    const point = document.getElementById(pointId);
    this.renderer.addClass(point, 'highlight');
  }

  resetChart() {
    Swal({
      title: this.translate.instant('confirmResetChart'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('no')
    }).then((result) => {
      if (result.value) {
        // this.router.navigate(['home/flowchart']);
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    // window.location.reload();
  }

}
