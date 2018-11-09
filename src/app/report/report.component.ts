import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TaskService} from '../service/taskService';
import {BsModalService} from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as echarts from 'echarts';
import Swal from 'sweetalert2';
import {User} from '../models/user';

declare var require: any;
const myChart = require('ngx-echarts');

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  resultObjRaw: any;
  simpleResultList: any;
  fullResultList: any;
  optionList: any;
  options: object;
  options1: object;
  options2: object;
  options3: object;
  options4: object;
  options5: object;
  options6: object;
  modalRef: BsModalRef;
  message: string;
  imgSrc1: string;
  imgSrc2: string;
  imgSrc3: string;
  imgSrc4: string;
  imgSrc5: string;
  imgSrc6: string;
  showStaticImg: boolean;
  resultId: number;
  indexList: any;

  @ViewChild('main') mainPage: ElementRef;
  @ViewChild('myChart1') myChart1: ElementRef;

  constructor(public user: User, private taskService: TaskService, private modalService: BsModalService) {
    this.user.mainShowing = false;
    this.resultId = 1;
    this.showStaticImg = false;
    this.simpleResultList = {
      'Enabler': {
        'total': 0,
        'actual': 0,
        'normalized': 0
      },
      'Lean': {
        'total': 0,
        'actual': 0,
        'normalized': 0
      },
      'I4.0': {
        'total': 0,
        'actual': 0,
        'normalized': 0
      }
    };

    this.fullResultList = {
      'Enabler': {
        'Standardization': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Transparent Processes': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Associate Involvement': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        }
      },
      'Lean': {
        'Continuous Improvement': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Perfect Quality': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Flexibility': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Pull System': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Process Orientation': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        }
      },
      'I4.0': {
        'Resource': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Digitization': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        },
        'Automation': {
          'total': 0,
          'actual': 0,
          'normalized': 0
        }
      }
    };
  }

  ngOnInit() {
    this.taskService.getAllResult(localStorage.getItem('user_name')).subscribe( res => {
      // @ts-ignore
      const rawResult = JSON.parse(res._body);
      const rawResultList = rawResult._embedded.results;
      const rawOptionList = rawResultList[rawResultList.length - 1].result.choices;
      this.resultId = rawResultList[rawResultList.length - 1].result.resultId;
      this.optionList = [];
      for ( const item of rawOptionList) {
        this.optionList.push(item.options[0].value * item.question.weight);
      }
      console.log(this.optionList);
      console.log(this.resultId);

      this.taskService.getResultById(this.resultId).subscribe( data => {
        // @ts-ignore
        this.resultObjRaw = JSON.parse(data._body);
        this.fullResultList.Enabler = this.resultObjRaw.Enabler;
        this.fullResultList.Lean = this.resultObjRaw['Lean'];
        this.fullResultList['I4.0'] = this.resultObjRaw['I4.0'];

        console.log(this.fullResultList.Enabler);
        console.log(this.fullResultList.Lean);
        console.log(this.fullResultList['I4.0']);

        this.simpleResultList.Enabler.total = this.fullResultList.Enabler['Associate Involvement'].total +
          this.fullResultList.Enabler['Transparent Processes'].total + this.fullResultList.Enabler.Standardization.total;
        this.simpleResultList.Enabler.actual = this.fullResultList.Enabler['Associate Involvement'].actual +
          this.fullResultList.Enabler['Transparent Processes'].actual + this.fullResultList.Enabler.Standardization.actual;
        this.simpleResultList.Enabler.normalized =
          ((this.simpleResultList.Enabler.actual / this.simpleResultList.Enabler.total) * 100).toFixed(2);

        this.simpleResultList.Lean.total = this.fullResultList.Lean['Continuous Improvement'].total +
          this.fullResultList.Lean['Perfect Quality'].total + this.fullResultList.Lean['Process Orientation'].total +
          this.fullResultList.Lean['Pull System'].total + this.fullResultList.Lean.Flexibility.total;
        this.simpleResultList.Lean.actual = this.fullResultList.Lean['Continuous Improvement'].actual +
          this.fullResultList.Lean['Perfect Quality'].actual + this.fullResultList.Lean['Process Orientation'].actual +
          this.fullResultList.Lean['Pull System'].actual + this.fullResultList.Lean.Flexibility.actual;
        this.simpleResultList.Lean.normalized =
          ((this.simpleResultList.Lean.actual / this.simpleResultList.Lean.total) * 100).toFixed(2);

        this.simpleResultList['I4.0'].total = this.fullResultList['I4.0'].Resource.total +
          this.fullResultList['I4.0'].Digitization.total + this.fullResultList['I4.0'].Automation.total;
        this.simpleResultList['I4.0'].actual = this.fullResultList['I4.0'].Resource.actual +
          this.fullResultList['I4.0'].Digitization.actual + this.fullResultList['I4.0'].Automation.actual;
        this.simpleResultList['I4.0'].normalized =
          ((this.simpleResultList['I4.0'].actual / this.simpleResultList['I4.0'].total) * 100).toFixed(2);

        this.indexList = [];
        for ( let i = 1; i <= this.optionList.length; i ++ ) {
          this.indexList.push(i);
        }
        this.options6 = {
          title: {
            text: 'Source Questions Status',
            y: 0
          },
          xAxis: {
            type: 'category',
            data: this.indexList
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.optionList,
            type: 'line'
          }]
        };

        this.options1 = {
          title: {
            text: 'Enabler-STA Radar Graph',
            y: 0
          },
          tooltip: {},
          legend: {
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: 'Standardization', max: 100},
              { name: 'Associate Involvement', max: 100},
              { name: 'Transparent Processes', max: 100}
            ]
          },
          series: [{
            name: '得分',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [
              {
                value : [this.fullResultList.Enabler.Standardization.normalized,
                  this.fullResultList.Enabler['Associate Involvement'].normalized,
                  this.fullResultList.Enabler['Transparent Processes'].normalized]
              }
            ],
            label: {
              show: true
            }
          }]
        };

        this.options2 = {
          title: {
            text: 'Lean-CFPPP Radar Graph'
          },
          tooltip: {},
          legend: {
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: 'Perfect Quality', max: 100},
              { name: 'Continuous Improvement', max: 100},
              { name: 'Associate Involvement', max: 100},
              { name: 'Pull System', max: 100},
              { name: 'Process Orientation', max: 100}
            ]
          },
          series: [{
            name: '得分',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [this.fullResultList.Lean['Perfect Quality'].normalized,
                  this.fullResultList.Lean['Continuous Improvement'].normalized,
                  this.fullResultList.Enabler['Associate Involvement'].normalized,
                  this.fullResultList.Lean['Pull System'].normalized,
                  this.fullResultList.Lean['Process Orientation'].normalized]
              }
            ],
            label: {
              show: true
            }
          }]
        };

        this.options3 = {
          title: {
            text: 'I4.0-RDA Radar Graph'
          },
          tooltip: {},
          legend: {
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: 'Process Orientation', max: 100},
              { name: 'Perfect Quality', max: 100},
              { name: 'Continuous Improvement', max: 100}
            ]
          },
          series: [{
            name: '得分',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [this.fullResultList.Lean['Process Orientation'].normalized,
                  this.fullResultList.Lean['Perfect Quality'].normalized,
                  this.fullResultList.Lean['Continuous Improvement'].normalized]
              }
            ],
            label: {
              show: true
            }
          }]
        };

        this.options4 = {
          title: {
            text: 'Source-Enabler Lean I4.0 Radar Graph'
          },
          tooltip: {},
          legend: {
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: 'Enabler', max: 100},
              { name: 'Lean', max: 100},
              { name: 'I4.0', max: 100}
            ]
          },
          series: [{
            name: '得分',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [this.simpleResultList.Enabler.normalized,
                  this.simpleResultList.Lean.normalized, this.simpleResultList['I4.0'].normalized]
              }
            ],
            label: {
              show: true
            }
          }]
        };

        this.options5 = {
          title: {
            text: '11 Dimensions Radar Graph'
          },
          tooltip: {},
          legend: {
          },
          radar: {
            // shape: 'circle',
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            indicator: [
              { name: 'Standardization', max: 100},
              { name: 'Automation', max: 100},
              { name: 'Digitization', max: 100},
              { name: 'Resource', max: 100},
              { name: 'Pull System', max: 100},
              { name: 'Process Orientation', max: 100},
              { name: 'Perfect Quality', max: 100},
              { name: 'Flexibility', max: 100},
              { name: 'Continuous Improvement', max: 100},
              { name: 'Associate Involvement', max: 100},
              { name: 'Transparent Processes', max: 100}
            ]
          },
          series: [{
            name: '得分',
            type: 'radar',
            // areaStyle: {normal: {}},
            data : [
              {
                value : [this.fullResultList.Enabler.Standardization.normalized, this.fullResultList['I4.0'].Automation.normalized,
                  this.fullResultList['I4.0'].Digitization.normalized, this.fullResultList['I4.0'].Resource.normalized,
                  this.fullResultList.Lean['Pull System'].normalized, this.fullResultList.Lean['Process Orientation'].normalized,
                  this.fullResultList.Lean['Perfect Quality'].normalized, this.fullResultList.Lean.Flexibility.normalized,
                  this.fullResultList.Lean['Continuous Improvement'].normalized,
                  this.fullResultList.Enabler['Associate Involvement'].normalized,
                  this.fullResultList.Enabler['Transparent Processes'].normalized]
              }
            ],
            label: {
              show: true
            }
          }]
        };

      });

    });

  }

  convertToImg() {
    this.showStaticImg = true;
    const myCharts1 = echarts.init(document.getElementById('myChart1'));
    this.imgSrc1 =  myCharts1._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const myCharts2 = echarts.init(document.getElementById('myChart2'));
    this.imgSrc2 =  myCharts2._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const myCharts3 = echarts.init(document.getElementById('myChart3'));
    this.imgSrc3 =  myCharts3._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const myCharts4 = echarts.init(document.getElementById('myChart4'));
    this.imgSrc4 =  myCharts4._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const myCharts5 = echarts.init(document.getElementById('myChart5'));
    this.imgSrc5 =  myCharts5._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const myCharts6 = echarts.init(document.getElementById('myChart6'));
    this.imgSrc6 =  myCharts6._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
  }

  createPdf() {
    this.convertToImg();
    Swal({
      title: '确认导出？',
      text: '将会生成pdf文件并下载',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        this.taskService.reportToPdf(this.mainPage.nativeElement.innerHTML).subscribe( res => {
          const file = new Blob([res.blob()], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          const link = document.createElement('a');
          link.setAttribute('href', fileURL);
          link.setAttribute('download', res.headers.get('Content-disposition').split('filename=')[1]);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
        Swal(
          '导出成功',
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          '已取消',
          '',
          'error'
        );
        this.showStaticImg = false;
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

}
