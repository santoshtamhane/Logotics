import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BrandsService } from '../../services/brands.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';
import { ChartOptions } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
// import {StatisticsService} from '../../services/statistics.service';
import * as _ from 'lodash';
import addDays from 'date-fns/addDays';
import { ZoomChartPage } from '../zoom-chart/zoom-chart.page';

@Component({
  selector: 'app-brand-dashboard',
  templateUrl: './brand-dashboard.page.html',
  styleUrls: ['./brand-dashboard.page.scss'],
})
export class BrandDashboardPage implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private brandservice: BrandsService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    this.userid = this.route.snapshot.paramMap.get('userid');
    this.brandid = this.route.snapshot.paramMap.get('brandid');
    this.event = this.route.snapshot.paramMap.get('event');
    this.eventdt = this.route.snapshot.paramMap.get('Date');
    this.brandList = this.brandservice
      .getBrandList(this.userid)
      .valueChanges();
    this.ikey = this.route.snapshot.paramMap.get('ikey');
  }
  @ViewChild('trendCanvas', null) trendCanvas: ElementRef;
  @ViewChild('trendCanvas2', null) trendCanvas2: ElementRef;
  @ViewChild('trendCanvas3', null) trendCanvas3: ElementRef;
  @ViewChild('v1Canvas', null) v1Canvas: ElementRef;
  @ViewChild('v2Canvas', null) v2Canvas: ElementRef;
  @ViewChild('v3Canvas', null) v3Canvas: ElementRef;
  @ViewChild('v4Canvas', null) v4Canvas: ElementRef;
  @ViewChild('v5Canvas', null) v5Canvas: ElementRef;
  @ViewChild('v6Canvas', null) v6Canvas: ElementRef;
  trendChart: any;
  trendChart2: any;
  trendChart3: any;
  v1Chart: any;
  v2Chart: any;
  v3Chart: any;
  v4Chart: any;
  brandList: Observable<any>;
  venueList: Observable<any>;
  adunitList: Observable<any>;
  userid: string;
  brandid: string;
  event: string;
  eventdt: any;
  selectedBrand: string;
  selectedVenue: string;
  selectedAdunit: string;
  totalDuration = 0;
  avgDurn = 0;
  avgShare = 0;
  avgProminence = 0;
  avgEEI = 0;
  avgQuality = 0;
  avgIndex = 0;
  tertiarycolr = '#00a651';
  bluecolr = '#0054a6';
  successcolr = '#a0d468';
  dangercolr = '#ed5565';
  primarycolr = '#28383c'; // '#4fc1e9';
  secondarycolr = '#fd625e'; // '#48cfad';
  primarycolrtrans = '#28383cbd'; // '#4fc1e9';
  secondarycolrtrans = '#fd625ebd'; // '#48cfad';
  titlecolr = '#5da5da';
  barcolr = '#01b8aa';
  barcolrtrans = '#01b8aa5e';
  axescolr = '#28383c';
  selectedDate = new Date();
  tvrate = 50000;
  mediavalue = 0;
  seeRate = false;
  seeVenue = false;
  seeAsset = false;
  seetopVenue = false;
  eeivenue = 'green';
  topVenue: any;
  topQVenue: any;
  topPVenue: any;
  topEEIVenue: any;
  sortedDurnGroup: any;
  v5Chart: any;
  v6Chart: any;
  seeinfoEEI = false;
  durationpermatch: any;
  sortedEEI: any;
  assetEEI: any;
  sortedMVArr: any;
  sortedastArr: any;
  logo: string;
  ikey: string;
  compareWith: any;
  dangerlimit = 25;
  successlimit = 36;
  TrendTitle: string;
  trendType = 'EEI';
  venueChartType = 'EEI';
  matchcount = 1;
  showGuage = 'EEI';
  venueTitle: string;
  ngOnInit() {
      this.selectedBrand = this.brandid;
      this.getVitalMetrics(this.selectedBrand);
      this.TrendChart(this.selectedBrand);

  }

  nextGuage(guage: string) {
    switch (guage) {
      case 'EEI' : {
        this.showGuage = 'Quality';
        break;
      }
      case 'Quality' : {
        this.showGuage = 'Prominence';
        break;
      }
      case 'Prominence' : {
        this.showGuage = 'Share';
        break;
      }
      case 'Share' : {
        this.showGuage = 'EEI';
        break;
      }
    }
  }
 prevGuage(guage: string) {
    switch (guage) {
      case 'EEI' : {
        this.showGuage = 'Share';
        break;
      }
      case 'Quality' : {
        this.showGuage = 'EEI';
        break;
      }
      case 'Prominence' : {
        this.showGuage = 'Quality';
        break;
      }
      case 'Share' : {
        this.showGuage = 'Prominence';
        break;
      }
    }
  }

  changeTrendViewFwd() {
    switch (this.trendType) {
      case 'EEI': {
        this.trendType = 'Duration';
        break;
      }
      case 'Duration': {
        this.trendType = 'Quality';
        break;
      }
      case 'Quality': {
        this.trendType = 'Prominence';
        break;
      }
      case 'Prominence': {
        this.trendType = 'Share';
        break;
      }
      case 'Share': {
        this.trendType = 'EEI';
        break;
      }
    }
    this.TrendChart(this.selectedBrand);
  }
  changeTrendViewBack() {
    switch (this.trendType) {
      case 'EEI': {
        this.trendType = 'Share';
        break;
      }
      case 'Duration': {
        this.trendType = 'EEI';
        break;
      }
      case 'Quality': {
        this.trendType = 'Duration';
        break;
      }
      case 'Prominence': {
        this.trendType = 'Quality';
        break;
      }
      case 'Share': {
        this.trendType = 'Prominence';
        break;
      }
    }
    this.TrendChart(this.selectedBrand);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  getVitalMetrics(brandid: string) {
    this.brandservice
      .getBrandInfo(brandid)
      .valueChanges()
      .subscribe(branddocs => {
        console.log('branddoc=', branddocs.length);
        this.totalDuration = branddocs.map(res => res).reduce((acc, val) => acc + val.Durn, 0);
        this.avgDurn = branddocs.map(res => res).reduce((acc, val) => acc + val.Durn, 0) / branddocs.length;
        this.avgShare = branddocs.map(res => res).reduce((acc, val) => acc + val.Share, 0) / branddocs.length;
        this.avgProminence = branddocs.map(res => res).reduce((acc, val) => acc + val.P, 0) / branddocs.length;
        this.avgQuality = branddocs.map(res => res).reduce((acc, val) => acc + val.Q, 0) / branddocs.length;
        this.avgIndex = branddocs.map(res => res).reduce((acc, val) => acc + val.EEI, 0) / branddocs.length;
        branddocs.map(res => {this.logo = res.logo; });
  });
}



gotoEvent(eventid: string, event: string, Date, ikey: string) {
  this.navCtrl.navigateForward(['/event-dashboard',
  {userid: this.userid, eventid, event, Date, ikey}]);

  }

compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }


TrendChart(brandid: string) {
    const arr = [];
    const arr1 = [];
    this.brandservice
      .getBrandInfo(brandid)
      .valueChanges()
      .subscribe(data => {
        data.map(a =>
          arr1.push({
            EEI: a.EEI,
            Quality: a.Q,
            Prominence: a.P,
            Share: a.Share,
            Durn: a.Durn
          })
        );
        switch (this.trendType) {
          case 'EEI': {
            data.map(a =>
              arr.push({
                eventid: a.eventid,
                param: a.EEI,
                Quality: a.Q,
                Prominence: a.P,
                Share: a.Share
              })
            );
            this.TrendTitle = 'E.E.I TREND';
            break;
          }
          case 'Duration': {
            data.map(a =>
              arr.push({
                eventid: a.eventid,
                param: a.Durn,
                Quality: a.Q,
                Prominence: a.P,
                Share: a.Share
              })
            );
            this.TrendTitle = 'EXPOSURE DURATION TREND';
            break;
          }
          case 'Quality': {
            data.map(a =>
              arr.push({
                eventid: a.eventid,
                param: a.Q,
              })
            );
            this.TrendTitle = 'QUALITY OF EXPOSURE TREND';
            break;
          }
          case 'Prominence': {
            data.map(a =>
              arr.push({
                eventid: a.eventid,
                param: a.P,
              })
            );
            this.TrendTitle = 'EXPOSURE PROMINENCE TREND';
            break;
          }
          case 'Share': {
            data.map(a =>
              arr.push({
                eventid: a.eventid,
                param: a.Share,
              })
            );
            this.TrendTitle = 'SHARE OF EVENT DURATION TREND';
            break;
          }
        }

        const sorted = _.sortBy(arr, 'eventDate');
        const sorted1 = _.orderBy(arr1, ['EEI'], ['asc']);

        if (this.trendChart2) {
          this.trendChart2.destroy();
        } // destroy previos instances
        this.trendChart2 = new Chart(this.trendCanvas2.nativeElement, {
          type: 'bar',
          data: {
            datasets: [
              {
                data: sorted.map(e => e.param.toFixed(2)),
                backgroundColor: this.primarycolr ,
                borderColor: this.primarycolr,
                borderWidth: 3,
                barThickness: 16,
                maxBarThickness: 18,
                minBarLength: 2,
                fill: false
              },
            ],
            labels: sorted.map(l => l.eventid)
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr,
                  },
                  gridLines: {
                    drawOnChartArea: false,
                    zeroLineColor: this.primarycolr,
                    color: this.axescolr
                  }
                }
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr,
                  },
                  gridLines: {
                    drawBorder: false,
                    drawOnChartArea: true,
                    zeroLineColor: this.primarycolr,
                    color: this.axescolr
                  }
                }
              ]
            },
            title: {
              display: false,
              text: 'LAST 7 DAYS',
              position: 'top',
              fontColor: '#fff',
              fontSize: 16
            } as ChartOptions,
          }
        });
      });
  }

} // EOF
