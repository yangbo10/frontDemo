import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TaskService} from '../service/taskService';
import {BsModalService} from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as echarts from 'echarts';
import Swal from 'sweetalert2';
import {User} from '../models/user';
import {TranslateService} from 'ng2-translate';
import {Router} from '@angular/router';

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
  options7: object;
  modalRef: BsModalRef;
  message: string;
  imgSrc1: string;
  imgSrc2: string;
  imgSrc3: string;
  imgSrc4: string;
  imgSrc5: string;
  imgSrc6: string;
  imgSrc7: string;
  showStaticImg: boolean;
  resultId: number;
  indexList: any;
  activeCodeCorrect: boolean;
  activeCode: string;
  levelList: any;
  overAllLevel: string;

  @ViewChild('main') mainPage: ElementRef;
  @ViewChild('myChart1') myChart1: ElementRef;

  constructor(public user: User, private taskService: TaskService,
              private modalService: BsModalService, private router: Router,
              private translate: TranslateService) {
    this.user.mainShowing = false;
    this.resultId = 1;
    this.showStaticImg = false;
    this.activeCodeCorrect = false;
    this.activeCode = '';
    this.levelList = ['Beginner', 'Intermediate', 'Experienced', 'Expert', 'Top Performer'];
    this.simpleResultList = {
      'Enabler': {
        'total': 0,
        'actual': 0,
        'normalized': 0,
        'level': ''
      },
      'Lean': {
        'total': 0,
        'actual': 0,
        'normalized': 0,
        'level': ''
      },
      'I4.0': {
        'total': 0,
        'actual': 0,
        'normalized': 0,
        'level': ''
      }
    };

    this.fullResultList = {
      'Enabler': {
        'Standardization': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Transparent Processes': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Associate Involvement': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        }
      },
      'Lean': {
        'Continuous Improvement': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Perfect Quality': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Flexibility': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Pull System': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Process Orientation': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        }
      },
      'I4.0': {
        'Resource': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Digitization': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        },
        'Automation': {
          'total': 0,
          'actual': 0,
          'normalized': 0,
          'level': ''
        }
      }
    };
  }

  ngOnInit() {
    this.taskService.getAllResult(localStorage.getItem('user_name')).subscribe( res => {
      // @ts-ignore
      const rawResult = JSON.parse(res._body);
      // verify empty
      if (rawResult.hasOwnProperty('_embedded')) {
        const rawResultList = rawResult._embedded.results;
        const rawOptionList = rawResultList[rawResultList.length - 1].result.choices;
        this.resultId = rawResultList[rawResultList.length - 1].result.resultId;
        const overallScore = rawResultList[rawResultList.length - 1].result.score;
        this.overAllLevel = this.cacualateLevel(overallScore);
        this.optionList = [];
        for ( const item of rawOptionList) {
          this.optionList.push(item.options[0].value * item.question.weight);
        }

        this.taskService.getResultById(this.resultId).subscribe( data => {
          // @ts-ignore
          this.resultObjRaw = JSON.parse(data._body);
          this.fullResultList.Enabler = this.resultObjRaw.Enabler;
          this.fullResultList.Lean = this.resultObjRaw['Lean'];
          this.fullResultList['I4.0'] = this.resultObjRaw['I4.0'];
          this.fullResultList.Enabler.Standardization.level =
            this.cacualateLevel(this.fullResultList.Enabler.Standardization.normalized);
          this.fullResultList.Enabler['Associate Involvement'].level =
            this.cacualateLevel(this.fullResultList.Enabler['Associate Involvement'].normalized);
          this.fullResultList.Enabler['Transparent Processes'].level =
            this.cacualateLevel(this.fullResultList.Enabler['Transparent Processes'].normalized);
          this.fullResultList.Lean.Flexibility.level =
            this.cacualateLevel(this.fullResultList.Lean.Flexibility.normalized);
          this.fullResultList.Lean['Continuous Improvement'].level =
            this.cacualateLevel(this.fullResultList.Lean['Continuous Improvement'].normalized);
          this.fullResultList.Lean['Perfect Quality'].level =
            this.cacualateLevel(this.fullResultList.Lean['Perfect Quality'].normalized);
          this.fullResultList.Lean['Process Orientation'].level =
            this.cacualateLevel(this.fullResultList.Lean['Process Orientation'].normalized);
          this.fullResultList.Lean['Pull System'].level =
            this.cacualateLevel(this.fullResultList.Lean['Pull System'].normalized);
          this.fullResultList['I4.0'].Resource.level =
            this.cacualateLevel(this.fullResultList['I4.0'].Resource.normalized);
          this.fullResultList['I4.0'].Digitization.level =
            this.cacualateLevel(this.fullResultList['I4.0'].Digitization.normalized);
          this.fullResultList['I4.0'].Automation.level =
            this.cacualateLevel(this.fullResultList['I4.0'].Automation.normalized);

          console.log(this.fullResultList.Enabler);
          console.log(this.fullResultList.Lean);
          console.log(this.fullResultList['I4.0']);

          this.simpleResultList.Enabler.total = this.fullResultList.Enabler['Associate Involvement'].total +
            this.fullResultList.Enabler['Transparent Processes'].total + this.fullResultList.Enabler.Standardization.total;
          this.simpleResultList.Enabler.actual = this.fullResultList.Enabler['Associate Involvement'].actual +
            this.fullResultList.Enabler['Transparent Processes'].actual + this.fullResultList.Enabler.Standardization.actual;
          this.simpleResultList.Enabler.normalized =
            ((this.simpleResultList.Enabler.actual / this.simpleResultList.Enabler.total) * 100).toFixed(2);
          this.simpleResultList.Enabler.level = this.cacualateLevel(this.simpleResultList.Enabler.normalized);

          this.simpleResultList.Lean.total = this.fullResultList.Lean['Continuous Improvement'].total +
            this.fullResultList.Lean['Perfect Quality'].total + this.fullResultList.Lean['Process Orientation'].total +
            this.fullResultList.Lean['Pull System'].total + this.fullResultList.Lean.Flexibility.total;
          this.simpleResultList.Lean.actual = this.fullResultList.Lean['Continuous Improvement'].actual +
            this.fullResultList.Lean['Perfect Quality'].actual + this.fullResultList.Lean['Process Orientation'].actual +
            this.fullResultList.Lean['Pull System'].actual + this.fullResultList.Lean.Flexibility.actual;
          this.simpleResultList.Lean.normalized =
            ((this.simpleResultList.Lean.actual / this.simpleResultList.Lean.total) * 100).toFixed(2);
          this.simpleResultList.Lean.level = this.cacualateLevel(this.simpleResultList.Lean.normalized);

          this.simpleResultList['I4.0'].total = this.fullResultList['I4.0'].Resource.total +
            this.fullResultList['I4.0'].Digitization.total + this.fullResultList['I4.0'].Automation.total;
          this.simpleResultList['I4.0'].actual = this.fullResultList['I4.0'].Resource.actual +
            this.fullResultList['I4.0'].Digitization.actual + this.fullResultList['I4.0'].Automation.actual;
          this.simpleResultList['I4.0'].normalized =
            ((this.simpleResultList['I4.0'].actual / this.simpleResultList['I4.0'].total) * 100).toFixed(2);
          this.simpleResultList['I4.0'].level = this.cacualateLevel(this.simpleResultList['I4.0'].normalized);

          console.log(this.fullResultList);
          this.indexList = [];
          for ( let i = 1; i <= this.optionList.length; i ++ ) {
            this.indexList.push(i);
          }
          this.options1 = {
            title: {
              text: 'Enabler-STA Radar Graph',
              y: -5
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
              name: this.translate.instant('score'),
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
              text: 'Lean-CFPPP Radar Graph',
              y: -5
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
              name: this.translate.instant('score'),
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
              text: 'I4.0-RDA Radar Graph',
              y: -5
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
              name: this.translate.instant('score'),
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
              text: 'Source-Enabler Lean I4.0 Radar Graph',
              y: -5
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
              name: this.translate.instant('score'),
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
              text: '11 Dimensions Radar Graph',
              y: -5
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
              name: this.translate.instant('score'),
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

          this.options7 = {
            title: {
              text: 'GSMD',
              y: -5
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
                { name: 'General', max: 100},
                { name: 'Source', max: 100},
                { name: 'Make', max: 100},
                { name: 'Deliver', max: 100}
              ]
            },
            series: [{
              name: this.translate.instant('score'),
              type: 'radar',
              // areaStyle: {normal: {}},
              data : [
                {
                  value : [this.simpleResultList.Lean.normalized,
                    this.simpleResultList.Lean.normalized,
                    this.simpleResultList.Enabler.normalized,
                    this.simpleResultList['I4.0'].normalized]
                }
              ],
              label: {
                show: true
              }
            }]
          };

        });
      } else {
        Swal(
          this.translate.instant('noReport'),
          '',
          'error'
        );
      }
    });

  }

  cacualateLevel(score) {
    return 'Level ' + ((score - 0.01) / 20 + 1).toString().substring(0, 1);
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
    const myCharts7 = echarts.init(document.getElementById('myChart7'));
    this.imgSrc7 =  myCharts7._api.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
  }

  createPdf() {
    this.convertToImg();
    Swal({
      title: this.translate.instant('exportConfirm'),
      text: this.translate.instant('exportDescribe'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('sure'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.taskService.reportToPdf('<!DOCTYPE html>\n' +
          '<html lang="en">\n' +
          '<head>\n' +
          '    <meta charset="UTF-8">\n' +
          '</head>\n' +
          '<body>' +
          this.mainPage.nativeElement.innerHTML +
          '</body>\n' +
          '</html>').subscribe( res => {
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
          this.translate.instant('exportSuccess'),
          '',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          this.translate.instant('canceled'),
          '',
          'error'
        );
        this.showStaticImg = false;
      }
    });
  }



}
