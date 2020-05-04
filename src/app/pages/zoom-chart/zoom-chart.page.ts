import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import { NavParams, ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import { ChartOptions } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-zoom-chart',
  templateUrl: './zoom-chart.page.html',
  styleUrls: ['./zoom-chart.page.scss'],
})
export class ZoomChartPage implements OnInit {
  @ViewChild('ChartCanvas', null) ChartCanvas: ElementRef;
  ZoomChart: any;
  brandid: string;
  eventid: string;
  eventdt: string;
  palette = '#7044ff' ; // '#009bd3';
  warningcolr = '#ffd662bd';
  successcolr = '#2c5f2dbd';
  dangercolr = '#ed2b33bd';
  primarycolr = '#002c54';
  secondarycolr = '#ffec5c';
  titlecolr = '#fff';
  trendType: string;
  TrendTitle: string;
  constructor(private modalCtrl: ModalController,
              private navParams: NavParams, private dashboardservice: DashboardService) {}

  ngOnInit() {
    this.trendType = this.navParams.data.trendType;
    this.brandid = this.navParams.data.brandid;
    this.eventid = this.navParams.data.eventid;
    this.eventdt = this.navParams.data.eventdt;
    this.EEItrend();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  EEItrend() {
  let arr = [];
  this.dashboardservice.getMatchbyDates(this.eventid, this.brandid, this.eventdt)
    .valueChanges().subscribe(data => {
    switch (this.trendType) {
        case 'EEI': {
          arr = [];
          data.map(a => arr.push({eventDate: a.Dt.seconds, param: a.EEI, lNPL: a.elNPL,
          uNPL: a.euNPL, cl: a.ECL, Quality: a.Q, Prominence: a.P, Share: a.Share}));
          this.TrendTitle = 'E.E.I TREND';
          break;
        }
        case 'Duration' : {
          arr = [];
          data.map(a => arr.push({eventDate: a.Dt.seconds, param: a.Durn, lNPL: a.dlNPL,
            uNPL: a.duNPL, cl: a.DCL, Quality: a.Q, Prominence: a.P, Share: a.Share}));
          this.TrendTitle = 'EXPOSURE DURATION TREND';
          break;
        }
        case 'Quality' : {
          data.map(a => arr.push({eventDate: a.Dt.seconds, param: a.Q, lNPL: 0,
            uNPL: 0, cl: 0}));
          this.TrendTitle = 'QUALITY OF EXPOSURE TREND';
          break;
          }
          case 'Prominence' : {
            data.map(a => arr.push({eventDate: a.Dt.seconds, param: a.P, lNPL: 0,
              uNPL: 0, cl: 0}));
            this.TrendTitle = 'EXPOSURE PROMINENCE TREND';
            break;
            }
          case 'Share' : {
              data.map(a => arr.push({eventDate: a.Dt.seconds, param: a.Share, lNPL: 0,
                uNPL: 0, cl: 0}));
              this.TrendTitle = 'SHARE OF EVENT DURATION TREND';
              break;
              }
      }

    const sorted = _.sortBy(arr, 'eventDate');
    console.log('zdata=', sorted);
    if (this.ZoomChart) { this.ZoomChart.destroy(); } // destroy previos instances
 /* const ctx = this.ChartCanvas.nativeElement.getContext('2d');
  const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
  gradientStroke.addColorStop(0, '#0cd1e8');
  gradientStroke.addColorStop(1, '#0cd1e821'); */
    this.ZoomChart = new Chart(this.ChartCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
         // data: _.values(won),
         data: sorted.map(e => (e.param).toFixed(2)),
          backgroundColor: this.primarycolr,
           borderColor: this.primarycolr,
           borderWidth: 2,
           pointRadius: 2.5,
           fill : false,
        }
  ],
       labels: sorted.map(l => new Date(l.eventDate * 1000).toISOString().slice(0, 10))
      },
     options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false},
          tooltips: {
            callbacks: {
              Label(tooltipItem, d) {
                return 'EEI';
              },
                afterLabel(tooltipItem, d) {
                    return  'Prominence: ' + (sorted[tooltipItem.index].Prominence).toFixed(2)
                    + ' Quality: ' + (sorted[tooltipItem.index].Quality).toFixed(2);
                }
            }
        },
      scales: {
        xAxes: [{
    ticks: {
         beginAtZero: true
    },
          gridLines: {
            drawOnChartArea: false
          },
        }],
        yAxes: [{
            ticks: {
            beginAtZero: true
        },
          gridLines: {
            drawBorder: true,
            drawOnChartArea: false
          },
        }]
    },
      title: {
        display: false,
        text: 'LAST 7 DAYS',
        position: 'top',
        fontColor: this.primarycolr,
    }
    ,
    annotation: {
      drawTime: 'afterDraw',
      annotations: [{
        id: 'box1',
        type: 'box',
        yScaleID: 'y-axis-0',
        yMin: arr[0].lNPL,
        yMax: arr[0].uNPL,
        backgroundColor: '#10dc6021',
        borderColor: this.successcolr,
        borderDash: [10, 5],
        borderWidth: 0.75,
      }, {
        id: 'hline3',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: arr[0].cl,
        borderColor: this.dangercolr,
        borderWidth: 2,
        label: {
           backgroundColor: this.successcolr,
           content: 'Mean',
           enabled: true
        }
     }, {
      id: 'hline4',
      type: 'line',
      mode: 'horizontal',
      scaleID: 'y-axis-0',
      value: arr[0].uNPL,
      borderColor: this.successcolr,
      borderWidth: 2,
      label: {
         backgroundColor: this.successcolr,
         content: 'upper limit',
         enabled: true
      }
   }, {
    id: 'hline5',
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: arr[0].lNPL,
    borderColor: this.successcolr,
    borderWidth: 2,
    label: {
       backgroundColor: this.successcolr,
       content: 'lower limit',
       enabled: true
    }
  }
    ]
    } as ChartOptions,
    plugins: [ChartAnnotation]
  },
    }) ;
  });
}
} // EOF
