import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
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
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.page.html',
  styleUrls: ['./event-dashboard.page.scss']
})
export class EventDashboardPage implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dashboardservice: DashboardService,
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
    this.userid = this.route.snapshot.paramMap.get('userid');
    this.eventid = this.route.snapshot.paramMap.get('eventid');
    this.event = this.route.snapshot.paramMap.get('event');
    this.eventdt = this.route.snapshot.paramMap.get('Date');
    this.brandList = this.dashboardservice
      .getBrandList(this.eventid, this.userid)
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
  eventid: string;
  event: string;
  eventdt: any;
  selectedBrand: string;
  selectedVenue: string;
  selectedAdunit: string;
  totalDuration = 0;
  avgShare = 0;
  avgProminence = 0;
  avgEEI = 0;
  avgQuality = 0;
  avgIndex = 0;
  tertiarycolr = '#00a651';
  bluecolr = '#0054a6';
  successcolr = '#a0d468';
  dangercolr = '#ed5565';
  primarycolr = '#01b8aa'; // '#4fc1e9';
  primarycolrtrans = '#01b8aa1a';
  white = '#fff';
  black = '#000';
  secondarycolr = '#fff'; // '#48cfad';
  titlecolr = '#5da5da';
  barcolr1 = '#28383c';
  barcolr2 = '#fd625e';
  axescolr1 = '#fd625e';
  axescolr2 = '#28383c';
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
  maxDurn = 0;
  minDurn = 0;
  maxMVE = 0;
  minMVE = 0;
  matchcount = 1;
  qvenue: string;
  pvenue: string;
  svenue: string;
  qguage = 0;
  pguage = 0;
  sguage = 0;
  showGuage = 'EEI';
  venueTitle: string;
  ngOnInit() {
    this.brandList.subscribe(b => {
      this.selectedBrand = b[0].Name;
      this.getVitalMetrics(this.selectedBrand);
      this.getTopLocation(this.selectedBrand);
      this.assetEEIChart(this.selectedBrand, null);
    //  this.assetmediavalueDGChart(this.selectedBrand, null);
      this.TrendChart(this.selectedBrand);
      this.SocialChart(this.selectedBrand);
    });
  }

  changeBrand(brand: string) {
    this.selectedBrand = brand;
    this.getVitalMetrics(this.selectedBrand);
    this.getTopLocation(this.selectedBrand);
    // this.durationtrend(this.selectedBrand);
    this.TrendChart(this.selectedBrand);
    this.SocialChart(this.selectedBrand);
    // this.locationBarChart(this.selectedBrand);*/
    this.assetEEIChart(this.selectedBrand, null);
  //  this.assetmediavalueDGChart(this.selectedBrand, null);
  }
  onSelectChange(selectedValue: any) {
    console.log('Selected', selectedValue);
  }
  changeVenue(venue: string) {
    this.selectedVenue = venue;
    this.assetEEIChart(this.selectedBrand, this.selectedVenue);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedVenue);
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
  changeVenueViewFwd() {
    switch (this.venueChartType) {
      case 'EEI': {
        this.venueChartType = 'Duration';
        break;
      }
      case 'Duration': {
        this.venueChartType = 'Quality';
        break;
      }
      case 'Quality': {
        this.venueChartType = 'Prominence';
        break;
      }
      case 'Prominence': {
        this.venueChartType = 'Share';
        break;
      }
      case 'Share': {
        this.venueChartType = 'EEI';
        break;
      }
    }
    this.getTopLocation(this.selectedBrand);
  }
  changeVenueViewBk() {
    switch (this.venueChartType) {
      case 'EEI': {
        this.venueChartType = 'Share';
        break;
      }
      case 'Duration': {
        this.venueChartType = 'EEI';
        break;
      }
      case 'Quality': {
        this.venueChartType = 'Duration';
        break;
      }
      case 'Prominence': {
        this.venueChartType = 'Quality';
        break;
      }
      case 'Share': {
        this.venueChartType = 'Prominence';
        break;
      }
    }
    this.getTopLocation(this.selectedBrand);
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
  async openModal(selectedBrand: string) {
    const modal = await this.modalCtrl.create({
      component: ZoomChartPage,
      cssClass: 'modal-class',
      componentProps: {
        trendType: this.trendType,
        brandid: selectedBrand,
        eventid: this.eventid,
        eventdt: this.eventdt
      }
    });
    return await modal.present();
  }
  getVitalMetrics(brandid: string) {
    this.dashboardservice
      .getBrandInfo(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(eventdocs => {
        const durnArray = [];
        const mveArray = [];
        /* this.totalDuration = eventdocs.map(res => res).reduce((acc, val) => acc + val.eventDuration, 0);
this.avgShare = eventdocs.map(res => res).reduce((acc, val) => acc + val.Share, 0) / eventdocs.length;
this.avgProminence = eventdocs.map(res => res).reduce((acc, val) => acc + val.Prominence, 0) / eventdocs.length;
this.avgQuality = eventdocs.map(res => res).reduce((acc, val) => acc + val.Quality, 0) / eventdocs.length;
this.avgIndex = eventdocs.map(res => res).reduce((acc, val) => acc + val.EEI, 0) / eventdocs.length;*/
        eventdocs.map(res => {
          this.logo = res.logo;
          this.totalDuration = res.Durn;
          this.avgShare = res.Share;
          this.avgProminence = res.P;
          this.avgQuality = res.Q;
          this.avgIndex = res.EEI;
          this.durationpermatch = res.avgDuration;
          this.maxDurn = res.maxDurn;
          this.minDurn = res.minDurn;
          this.matchcount = res.matchcount;
          this.mediavalue =
            ((this.avgIndex / 100) * this.totalDuration * this.tvrate) / 10;
          this.qguage = res.Q ? Math.round(res.Q * 100) : 0;
          this.pguage = res.P ? Math.round(res.P * 100) : 0;
          this.sguage = res.Share
            ? +Math.round(res.Share * 100 * 100 + Number.EPSILON) / 100
            : 0;
          this.avgIndex = this.avgIndex ? Math.round(this.avgIndex / 100 * 100 + Number.EPSILON)
          : 0;
          if (this.avgIndex < this.dangerlimit) {
            this.eeivenue = 'red';
          } else if (
            this.avgIndex >= this.dangerlimit &&
            this.avgIndex < this.successlimit
          ) {
            this.eeivenue = 'yellow';
          } else {
            this.eeivenue = 'green';
          }
          if (this.avgQuality < 0.5) {
            this.qvenue = 'red';
          } else if (this.avgQuality >= 0.5 && this.avgQuality < 0.7) {
            this.qvenue = 'yellow';
          } else {
            this.qvenue = 'green';
          }
          if (this.avgProminence < 0.05) {
            this.pvenue = 'red';
          } else if (this.avgProminence >= 0.05 && this.avgProminence < 0.1) {
            this.pvenue = 'yellow';
          } else {
            this.pvenue = 'green';
          }
          if (this.avgShare < 0.05) {
            this.svenue = 'red';
          } else if (this.avgShare >= 0.05 && this.avgShare < 0.08) {
            this.svenue = 'yellow';
          } else {
            this.svenue = 'green';
          }
        });
      });
  }

  nextDay(dtdirection: number) {
    this.selectedDate = addDays(this.selectedDate, dtdirection);
  }
  setRate() {
    this.seeRate = !this.seeRate;
    if (!this.seeRate) {
      this.assetmediavalueDGChart(this.selectedBrand, null);
    }
  }

  infoEEI() {
    this.seeinfoEEI = !this.seeinfoEEI;
    if (!this.seeinfoEEI) {
      this.getTopLocation(this.selectedBrand);
    }
  }
  setVenue() {
    this.seeVenue = !this.seeVenue;
    if (!this.seeVenue) {
      this.getTopLocation(this.selectedBrand);
    }
    // this.venueList = this.dashboardservice.getVenuesList(this.eventid).valueChanges();
  }
  setAsset() {
    this.seeAsset = !this.seeAsset;
    if (!this.seeAsset) {
     // this.assetmediavalueDGChart(this.selectedBrand, null);
     this.assetEEIChart(this.selectedBrand, null);
    }
    // this.venueList = this.dashboardservice.getVenuesList(this.eventid).valueChanges();
  }

  checktopVenue() {
    this.seetopVenue = !this.seetopVenue;
  }

  getTopLocation(brandid: string) {
    this.dashboardservice
      .getVenueInfo(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        const mvArr = [];
        const barColors = [];
        let datapoints = [];
        let title = '';
        let annotationType = '';
        const sortedDurnGroup = _.sortBy(data, o => o.avgDuration).reverse();
        this.topVenue = sortedDurnGroup[0].venue;
        const sortedQualityGroup = _.sortBy(data, o => o.Q).reverse();
        // this.topQVenue = sortedQualityGroup[0].venue;

        const sortedPromGroup = _.sortBy(data, o => o.P).reverse();
        // this.topPVenue = sortedPromGroup[0].venue;

        const sortedEEIGroup = _.sortBy(data, o => o.EEI).reverse();
        this.topEEIVenue = sortedEEIGroup[0].venue;
        this.sortedEEI = sortedEEIGroup;
        const ctx = this.trendCanvas2.nativeElement.getContext('2d');
        const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
        gradientStroke.addColorStop(0, this.white);
        gradientStroke.addColorStop(1, this.primarycolr);
        data.map(d =>
          mvArr.push({
            venue: d.venue,
            EEI: d.EEI,
            Duration: d.Durn,
            P: d.P * 100,
            Q: d.Q,
            Share: d.Share,
            avgDurn: d.avgDuration,
            MV: (d.EEI * d.Durn * this.tvrate) / (10 * 10000000)
          })
        );
        switch (this.venueChartType) {
          case 'EEI': {
            this.sortedMVArr = _.sortBy(mvArr, m => m.EEI).reverse();
            datapoints = this.sortedMVArr.map(v => v.EEI);
            title = 'EEI per venue';
            this.venueTitle = 'EEI per venue';
            annotationType = 'line';
            break;
          }
          case 'Duration': {
            this.sortedMVArr = _.sortBy(mvArr, m => m.avgDurn).reverse();
            datapoints = this.sortedMVArr.map(v => v.avgDurn);
            title = 'Typical Exposure Duration per venue';
            this.venueTitle = 'Typical Exposure Duration per venue';
            annotationType = '';
            break;
          }
          case 'Quality': {
            this.sortedMVArr = _.sortBy(mvArr, m => m.Q).reverse();
            datapoints = this.sortedMVArr.map(v => v.Q);
            title = 'Exposure Quality per venue';
            this.venueTitle = 'Exposure Quality per venue';
            annotationType = '';
            break;
          }
          case 'Prominence': {
            this.sortedMVArr = _.sortBy(mvArr, m => m.P).reverse();
            datapoints = this.sortedMVArr.map(v => v.P);
            title = 'Exposure Prominence per venue';
            this.venueTitle = 'Exposure Prominence per venue';
            annotationType = '';
            break;
          }
          case 'Share': {
            this.sortedMVArr = _.sortBy(mvArr, m => m.Share).reverse();
            datapoints = this.sortedMVArr.map(v => v.Share);
            title = 'Share of Event Duration per venue';
            this.venueTitle = 'Share of Event Duration per venue';
            annotationType = '';
            break;
          }
        }
        /* this.sortedMVArr.forEach(c => {
          if (c.EEI < this.dangerlimit) {
            barColors.push(this.dangercolr);
          } else if (c.EEI >= 25 && c.EEI < 36) {
            barColors.push(this.warningcolr);
          } else {
            barColors.push(this.successcolr);
          }
        });*/
        // draw charts
        if (this.v1Chart) {
          this.v1Chart.destroy();
        } // destroy previos instances
        this.v1Chart = new Chart(this.v1Canvas.nativeElement, {
          type: 'bar',
          data: {
            datasets: [
              {
                // data: _.values(sortedGroup),
                data: datapoints,
                backgroundColor: this.barcolr2,
                borderColor: this.barcolr2,
                borderWidth: 1,
                fill: false
              }
            ],
            // labels: _.keys(sortedGroup)
            labels: this.sortedMVArr.map(l => l.venue)
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            sort: 'desc',
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr2,
                  },
                  gridLines: {
                    drawOnChartArea: false,
                  }
                }
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr2,
                  },
                  gridLines: {
                    drawBorder: false,
                    drawOnChartArea: false
                  }
                }
              ]
            },
            title: {
              display: false,
              text: title,
              position: 'top',
              fontColor: this.barcolr2,
              fontSize: 16
            },
            annotation: {
              drawTime: 'afterDraw',
              annotations: [{
                id: 'hline1',
                type: annotationType,
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 25,
                borderColor: this.dangercolr,
                borderWidth: 0.8,
                label: {
                   backgroundColor: this.dangercolr,
                   position: 'right',
                   content: 'Low',
                   enabled: true
                }
             }, {
              id: 'hline2',
              type: annotationType,
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 36,
              borderColor: this.successcolr,
              borderWidth: 0.8,
              label: {
                 backgroundColor: this.successcolr,
                 position: 'right',
                 content: 'High',
                 enabled: true
              }
           }]
            } as ChartOptions,
            plugins: [ChartAnnotation]
          }
        });
      });
  }

  assetEEIChart(brandid: string, venue: string) {
    let datapoints = [];
    const astArr = [];
    let title = '';
    let annotationType = '';
    this.dashboardservice
      .getAssetInfo(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        const grouped = [];
        let catlabels = [];
        data.map(a => grouped.push({ EEI: a.EEI, Category: a.Category }));
        const sortedGroup = _.sortBy(grouped, o => o.EEI).reverse();
        datapoints = sortedGroup.map(v => v.EEI);
        catlabels = sortedGroup.map(v => v.Category);
        title = 'EEI per Media Asset';
        annotationType = 'line';
 // for asset table display
        data.map(d =>
          astArr.push({
            Category: d.Category,
            EEI: d.EEI,
            Duration: d.Durn,
            MV: (d.EEI * d.Durn * this.tvrate) / (10 * 10000000)
          })
        );
        this.sortedastArr = _.sortBy(astArr, m => m.EEI).reverse();
        const ctx = this.v2Canvas.nativeElement.getContext('2d');
        const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
        gradientStroke.addColorStop(0, this.white);
        gradientStroke.addColorStop(1, this.primarycolr);
        if (this.v2Chart) {
        this.v2Chart.destroy();
      } // destroy previos instances
        this.v2Chart = new Chart(this.v2Canvas.nativeElement, {
        type: 'bar',
        data: {
          datasets: [
            {
              // data: _.values(sortedGroup),
              data: datapoints,
              backgroundColor: this.barcolr1,
              borderColor: this.barcolr1,
              borderWidth: 1,
              barThickness: 45,
              fill: false
            }
          ],
          // labels: _.keys(sortedGroup)
          labels: catlabels
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          labels: {
            fontColor: this.axescolr2,
          },
          legend: {
            display: false
          },
          sort: 'desc',
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontColor: this.axescolr2,
                },
                gridLines: {
                  drawOnChartArea: false,
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontColor: this.axescolr2,
                },
                gridLines: {
                  drawBorder: false,
                  drawOnChartArea: false
                }
              }
            ]
          },
          title: {
            display: false,
            text: title,
            position: 'top',
            fontColor: this.axescolr1,
            fontSize: 16
          },
          annotation: {
            drawTime: 'afterDraw',
            annotations: [{
              id: 'hline1',
              type: annotationType,
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 25,
              borderColor: this.dangercolr,
              borderWidth: 0.8,
              label: {
                 backgroundColor: this.dangercolr,
                 position: 'right',
                 content: 'Low',
                 enabled: true
              }
           }, {
            id: 'hline2',
            type: annotationType,
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 36,
            borderColor: this.successcolr,
            borderWidth: 0.8,
            label: {
               backgroundColor: this.successcolr,
               position: 'right',
               content: 'High',
               enabled: true
            }
         }]
          } as ChartOptions,
          plugins: [ChartAnnotation]
        }
      });
});
  }

assetmediavalueDGChart(brandid: string, venue: string) {
    this.dashboardservice
      .getAssetInfo(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        const mVData = data.map(a => ({
          mv: Math.round((a.EEI * a.Durn * this.tvrate) / (10 * 10000000)),
          asset: a.Category,
          venue: a.venue
        }));

        let grouped = [];
        if (venue) {
          grouped = _(mVData)
            .filter(v => v.venue === venue)
            .groupBy('asset')
            .map((d, key) => ({
              asset: key,
              mv: _.sumBy(d, 'mv')
            }))
            .value();
        } else {
          grouped = _(mVData)
            .groupBy('asset')
            .map((d, key) => ({
              asset: key,
              mv: _.sumBy(d, 'mv')
            }))
            .value();
        }
        const sortedGroup = _.sortBy(grouped, o => o.mv).reverse();
        const datapoints = sortedGroup.map(v => v.mv);
        const catlabels = sortedGroup.map(v => v.asset);
        if (this.v6Chart) {
          this.v6Chart.destroy();
        } // destroy previos instances
        // const sortedGroup =   _.sortBy(grouped, o => o.Duration).reverse();
        this.v6Chart = new Chart(this.v6Canvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: catlabels,
            datasets: [
              {
                label: 'Duration (seconds)',
                backgroundColor: [
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.primarycolr,
                  this.bluecolr,
                  this.dangercolr,
                  this.titlecolr,
                  this.successcolr,
                ],
                borderColor: [
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.primarycolr,
                  this.bluecolr,
                  this.dangercolr,
                  this.titlecolr,
                  this.successcolr,
                ],
                borderWidth: 1,
                data: datapoints
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: false,
              position: 'bottom',
              text: 'Asset wise Media Value',
              fontSize: 16
            },
            legend: {
              display: true,
              position: 'right',
              fontColor: 'white',
              labels: {
              fontColor: this.axescolr1,
            },
            },
            cutoutPercentage: '80'
          }
        });
      });
  }

gotoVenue(venue: string) {
    this.navCtrl.navigateForward([
      '/dashboard-b',
      {
        eventid: this.eventid,
        event: this.event,
        Date: this.eventdt,
        venue,
        brand: this.selectedBrand,
        tvrate: this.tvrate,
        logo: this.logo,
        ikey: this.ikey
      }
    ]);
  }

gotoAsset(asset: string) {
    this.navCtrl.navigateForward([
      '/dashboard-c',
      {
        eventid: this.eventid,
        event: this.event,
        Date: this.eventdt,
        asset,
        brand: this.selectedBrand,
        tvrate: this.tvrate,
        logo: this.logo,
        ikey: this.ikey
      }
    ]);
  }
compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
changePage(dpage: any, brand: string) {
    switch (dpage.detail.value) {
      case '1. Overview': {
        this.navCtrl.navigateForward([
          '/dashboard-a',
          { eventid: this.eventid, event: this.event, Date: this.eventdt }
        ]);
        break;
      }
      case '2. Venue Analysis': {
        this.navCtrl.navigateForward([
          '/dashboard-b',
          { eventid: this.eventid, event: this.event, Date: this.eventdt }
        ]);
        break;
      }
    }
  }

TrendChart(brandid: string) {
    const arr = [];
    const arr1 = [];
    this.dashboardservice
      .getLast7MatchbyDates(this.eventid, brandid, this.eventdt)
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
                eventDate: a.Dt.seconds,
                param: a.EEI,
                lNPL: a.elNPL,
                uNPL: a.euNPL,
                cl: a.ECL,
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
                eventDate: a.Dt.seconds,
                param: a.Durn,
                lNPL: a.dlNPL,
                uNPL: a.duNPL,
                cl: a.DCL,
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
                eventDate: a.Dt.seconds,
                param: a.Q,
                lNPL: 0,
                uNPL: 0,
                cl: 0
              })
            );
            this.TrendTitle = 'QUALITY OF EXPOSURE TREND';
            break;
          }
          case 'Prominence': {
            data.map(a =>
              arr.push({
                eventDate: a.Dt.seconds,
                param: a.P,
                lNPL: 0,
                uNPL: 0,
                cl: 0
              })
            );
            this.TrendTitle = 'EXPOSURE PROMINENCE TREND';
            break;
          }
          case 'Share': {
            data.map(a =>
              arr.push({
                eventDate: a.Dt.seconds,
                param: a.Share,
                lNPL: 0,
                uNPL: 0,
                cl: 0
              })
            );
            this.TrendTitle = 'SHARE OF EVENT DURATION TREND';
            break;
          }
        }

        const sorted = _.sortBy(arr, 'eventDate');
        const sorted1 = _.orderBy(arr1, ['EEI'], ['asc']);
        this.minMVE =
          (sorted1[0].EEI * sorted1[0].Durn * this.tvrate) / (10 * 10000000);
        const sorted2 = _.orderBy(arr1, ['EEI'], ['desc']);
        this.maxMVE =
          (sorted2[0].EEI * sorted2[0].Durn * this.tvrate) / (10 * 10000000);

        if (this.trendChart2) {
          this.trendChart2.destroy();
        } // destroy previos instances
        const ctx = this.trendCanvas2.nativeElement.getContext('2d');
        const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
        gradientStroke.addColorStop(0, this.primarycolrtrans);
        gradientStroke.addColorStop(1, this.primarycolrtrans);
        this.trendChart2 = new Chart(this.trendCanvas2.nativeElement, {
          type: 'line',
          data: {
            datasets: [
              {
                // data: _.values(won),
                data: sorted.map(e => e.param.toFixed(2)),
                backgroundColor: sorted[0].cl === 0 ? gradientStroke : this.primarycolrtrans ,
                borderColor: sorted[0].cl === 0 ? gradientStroke : this.primarycolr,
                borderWidth: 3,
                pointRadius: 3.5,
                fill: true
              },
              {
                data: sorted.map(e => Math.round(e.cl)),
                backgroundColor: this.black,
                borderColor: this.black,
                borderWidth: 2,
                pointRadius: 0,
                fill: false
              },
              {
                data: sorted.map(e => Math.round(e.uNPL)),
                fill: false,
                pointRadius: 0,
                borderWidth: 0
              },
              {
                data: sorted.map(e => Math.round(e.lNPL)),
                fill: false,
                pointRadius: 0,
                borderWidth: 0
              }
            ],
            labels: sorted.map(l =>
              new Date(l.eventDate * 1000).toISOString().slice(0, 10)
            )
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                Label(tooltipItem, d) {
                  return 'EEI';
                },
                afterLabel(tooltipItem, d) {
                  return (
                    'Prominence: ' +
                    sorted[tooltipItem.index].Prominence.toFixed(2) +
                    ' Quality: ' +
                    sorted[tooltipItem.index].Quality.toFixed(2)
                  );
                }
              }
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.primarycolr,
                  },
                  gridLines: {
                    drawOnChartArea: false,
                    zeroLineColor: this.secondarycolr,
                    color: '#908080'
                  }
                }
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.primarycolr,
                  },
                  gridLines: {
                    drawBorder: false,
                    drawOnChartArea: false,
                    zeroLineColor: this.secondarycolr,
                    color: '#808080'
                  }
                }
              ]
            },
            title: {
              display: false,
              text: 'LAST 7 DAYS',
              position: 'top',
              fontColor: this.white,
              fontSize: 16
            },
            annotation: {
              drawTime: 'afterDraw',
              annotations: [
                {
                  id: 'box1',
                  type: 'box',
                  yScaleID: 'y-axis-0',
                  yMin: arr[0].lNPL,
                  yMax: arr[0].uNPL,
                  backgroundColor: '#a0d4685e',
                  borderColor: this.successcolr,
                  borderDash: [10, 5],
                  borderWidth: 2
                }
              ]
            } as ChartOptions,
            plugins: [ChartAnnotation]
          }
        });
      });
  }

  SocialChart(brandid: string) {
    const arr = [];
    const arr1 = [];
    this.dashboardservice
      .getLast7MatchbyDates(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        data.map(a =>
          arr1.push({
            EEI: a.EEI,
            Quality: a.Q,
            Prominence: a.P,
            Share: a.Share,
            Durn: a.Durn,
            Mentions: a.Mentions
          })
        );
        data.map(a =>
              arr.push({
                eventDate: a.Dt.seconds,
                param: a.Durn,
                lNPL: a.dlNPL,
                uNPL: a.duNPL,
                cl: a.DCL,
                Quality: a.Q,
                Prominence: a.P,
                Share: a.Share,
                Mentions: a.Mentions
              })
            );

        const sorted = _.sortBy(arr, 'eventDate');
        const sorted1 = _.orderBy(arr1, ['EEI'], ['asc']);
        this.minMVE =
          (sorted1[0].EEI * sorted1[0].Durn * this.tvrate) / (10 * 10000000);
        const sorted2 = _.orderBy(arr1, ['EEI'], ['desc']);
        this.maxMVE =
          (sorted2[0].EEI * sorted2[0].Durn * this.tvrate) / (10 * 10000000);

        if (this.trendChart3) {
          this.trendChart3.destroy();
        } // destroy previos instances
        const ctx = this.trendCanvas3.nativeElement.getContext('2d');
        const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
        gradientStroke.addColorStop(0, this.white);
        gradientStroke.addColorStop(1, this.primarycolr);
        this.trendChart2 = new Chart(this.trendCanvas3.nativeElement, {
          type: 'line',
          data: {
            datasets: [
              {
                // data: _.values(won),
                data: sorted.map(e => e.param.toFixed(2)),
                backgroundColor: '#a9a9a9' ,
                borderColor: '#a9a9a9',
                borderWidth: 1.5,
                pointRadius: 1.5,
                fill: false,
                yAxisID: 'y-axis-2',
                label: 'Exposure Duration'
              },
              {
                // data: _.values(won),
                data: sorted.map(e => e.Mentions),
                backgroundColor: this.primarycolr ,
                borderColor: this.primarycolr,
                borderWidth: 3,
                pointRadius: 3.5,
                fill: false,
                yAxisID: 'y-axis-1',
                label: 'Social Media Mentions'
              },
              ],
            labels: sorted.map(l =>
              new Date(l.eventDate * 1000).toISOString().slice(0, 10)
            )
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: true,
              position: 'bottom',
              labels: {
              fontColor: this.primarycolr
              }
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.primarycolr,
                  },
                  gridLines: {
                    drawOnChartArea: true,
                    color: '#908080'
                  }
                }
              ],
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.primarycolr,
                  },
                  gridLines: {
                    drawBorder: true,
                    drawOnChartArea: false,
                    color: '#908080'
                  }
                },
                {
                  id: 'y-axis-2',
                  type: 'linear',
                  position: 'right',
                  ticks: {
                    beginAtZero: true,
                    fontColor: '#a9a9a9',
                  },
                  gridLines: {
                    drawBorder: true,
                    drawOnChartArea: false
                  }
                }
              ]
            },
            title: {
              display: false,
              text: 'LAST 7 DAYS',
              position: 'top',
              fontColor: this.black,
              fontSize: 16
            },
          }
        });
      });
  }
} // EOF
