import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import * as _ from 'lodash';
import addDays from 'date-fns/addDays';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-dashboard-b',
  templateUrl: './dashboard-b.page.html',
  styleUrls: ['./dashboard-b.page.scss']
})
export class DashboardBPage implements OnInit {
  @ViewChild('trendCanvas', null) trendCanvas: ElementRef;
  @ViewChild('trendCanvas2', null) trendCanvas2: ElementRef;
  @ViewChild('v1Canvas', null) v1Canvas: ElementRef;
  @ViewChild('v2Canvas', null) v2Canvas: ElementRef;
  @ViewChild('v3Canvas', null) v3Canvas: ElementRef;
  @ViewChild('v4Canvas', null) v4Canvas: ElementRef;
  @ViewChild('v5Canvas', null) v5Canvas: ElementRef;
  @ViewChild('v6Canvas', null) v6Canvas: ElementRef;
  trendChart: any;
  trendChart2: any;
  vChart: any;
  v2Chart: any;
  v3Chart: any;
  v4Chart: any;
  brandList: Observable<any>;
  venueList: Observable<any>;
  adunitList: Observable<any>;
  eventid: string;
  event: string;
  eventdt: any;
  selectedBrand: string;
  selectedVenue: string;
  selectedAdunit: string;
  tertiarycolr = '#00a651';
  bluecolr = '#0054a6';
  successcolr = '#a0d468';
  dangercolr = '#ed5565';
  primarycolr = '#28383c'; // '#4fc1e9';
  secondarycolr = '#fd625e'; // '#48cfad';
  titlecolr = '#5da5da';
  barcolr = '#01b8aa';
  axescolr = '#28383c';
  totalDuration = 0;
  avgShare = 0;
  avgProminence = 0;
  avgEEI = 0;
  avgQuality = 0;
  avgIndex = 0;
  selectedDate = new Date();
  tvrate: number;
  mediavalue = 0;
  seeRate = false;
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
  QRank = 0;
  PRank = 0;
  SRank = 0;
  EEIRank = 0;
  VenueCount: number;
  qvenue: string;
  pvenue: string;
  svenue: string;
  qguage = 0;
  pguage = 0;
  sguage = 0;
  logo: string;
  ikey: string;
  dangerlimit = 25;
  successlimit = 36;
  sortedGroup = [];
  grouped = [];
  showGuage = 'EEI';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dashboardservice: DashboardService,
    private menuCtrl: MenuController,
    public navCtrl: NavController
  ) {
    this.eventid = this.route.snapshot.paramMap.get('eventid');
    this.event = this.route.snapshot.paramMap.get('event');
    this.eventdt = this.route.snapshot.paramMap.get('Date');
    this.selectedVenue = this.route.snapshot.paramMap.get('venue');
    this.selectedBrand = this.route.snapshot.paramMap.get('brand');
    this.tvrate = parseFloat(this.route.snapshot.paramMap.get('tvrate'));
    this.logo = this.route.snapshot.paramMap.get('logo');
    this.ikey = this.route.snapshot.paramMap.get('ikey');
    // this.brandList = this.dashboardservice.getBrandList(this.eventid).valueChanges();
    this.venueList = this.dashboardservice
      .getVenuesList(this.eventid)
      .valueChanges();
  }

  ngOnInit() {
    this.getVenueMetrics(this.selectedBrand, this.selectedVenue);
    // this.getEEI_BoxPlot(this.selectedBrand, this.selectedVenue);
    this.VenuewiseAssetChart(this.selectedBrand, this.selectedVenue);
    this.assetDGChart(this.selectedBrand, this.selectedVenue);
    this.getLocationRanks(this.selectedBrand, this.selectedVenue);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedVenue);
  }

  randomValues(count, min, max) {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
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
  changeBrand(brand: string) {
    this.selectedBrand = brand;
    this.getVenueMetrics(this.selectedBrand, this.selectedVenue);
    this.VenuewiseAssetChart(this.selectedBrand, this.selectedVenue);
    this.assetDGChart(this.selectedBrand, null);
    // this.assetmediavalueDGChart(this.selectedBrand, null);
    this.getLocationRanks(this.selectedBrand, this.selectedVenue);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedVenue);
  }
  changeVenue(venue: string) {
    this.selectedVenue = venue;
    this.getVenueMetrics(this.selectedBrand, this.selectedVenue);
    // this.getEEI_BoxPlot(this.selectedBrand, this.selectedVenue);
    this.VenuewiseAssetChart(this.selectedBrand, this.selectedVenue);
    this.assetDGChart(this.selectedBrand, this.selectedVenue);
    this.getLocationRanks(this.selectedBrand, this.selectedVenue);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedVenue);
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  getVenueMetrics(brandid: string, venueid: string) {
    this.dashboardservice
      .getBrandVenueInfo(this.eventid, brandid, venueid, null)
      .valueChanges()
      .subscribe(eventdocs => {
        eventdocs.map(res => {
          this.totalDuration = res.Durn;
          this.avgShare = res.Share;
          this.avgProminence = res.P;
          this.avgQuality = res.Q;
          this.avgIndex = res.EEI;
          this.durationpermatch = res.avgDuration;
          this.mediavalue =
            (this.avgIndex * this.totalDuration * this.tvrate) / 10;
          this.qguage = res.Q ? Math.round(res.Q * 100) : 0;
          this.pguage = res.P ? Math.round(res.P * 100) : 0;
          this.sguage = res.Share
            ? +Math.round(res.Share * 100 * 100 + Number.EPSILON) / 100
            : 0;
          if (this.avgIndex < 25) {
            this.eeivenue = 'red';
          } else if (this.avgIndex >= 25 && this.avgIndex < 36) {
            this.eeivenue = 'yellow';
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
      this.assetmediavalueDGChart(this.selectedBrand, this.selectedVenue);
    }
  }

  infoEEI() {
    this.seeinfoEEI = !this.seeinfoEEI;
    if (!this.seeinfoEEI) {
      // this.getEEI_BoxPlot(this.selectedBrand, this.selectedVenue);
    }
  }
  setAsset() {
    this.seeAsset = !this.seeAsset;
    this.VenuewiseAssetChart(this.selectedBrand, this.selectedVenue);
  }
  checktopVenue() {
    this.seetopVenue = !this.seetopVenue;
  }

  assetDGChart(brandid: string, venue: string) {
    this.dashboardservice
      .getAssetInfo(this.eventid, brandid, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        let grouped = [];
        if (venue) {
          grouped = _(data)
            .filter(v => v.venue === venue)
            .groupBy('asset')
            .map((d, key) => ({
              asset: key,
              Duration: _.sumBy(d, 'Durn')
            }))
            .value();
        } else {
          grouped = _(data)
            .groupBy('Category')
            .map((d, key) => ({
              asset: key,
              Duration: _.sumBy(d, 'Durn')
            }))
            .value();
        }

        // const sortedGroup = _.sortBy(grouped, o => o.Duration).reverse();
        this.v5Chart = new Chart(this.v5Canvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: grouped.map(v => v.Category),
            datasets: [
              {
                label: 'Duration (seconds)',
                backgroundColor: [
                  this.primarycolr,
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.successcolr,
                  this.dangercolr,
                  this.titlecolr
                ],
                borderColor: [
                  this.primarycolr,
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.successcolr,
                  this.dangercolr,
                  this.titlecolr
                ],
                borderWidth: 1,
                data: grouped.map(v => v.Duration)
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: false,
              text: 'Assetwise Exposure Duration',
              position: 'top',
              fontColor: this.secondarycolr,
              fontSize: 16
            },
            legend: {
              display: false
            }
          }
        });
      });
  }

  assetmediavalueDGChart(brandid: string, venue: string) {
    this.dashboardservice
      .getAssetVenueInfo(this.eventid, brandid, venue, this.eventdt)
      .valueChanges()
      .subscribe(data => {
        const mVData = data.map(a => ({
          mv: Math.round((a.EEI * a.Durn * this.tvrate) / (10 * 10000000)),
          asset: a.Category,
          venue: a.venue,
          EEI: a.EEI,
          Durn: a.Durn
        }));
        this.grouped = _(mVData)
          .groupBy('asset')
          .map((d, key) => ({
            asset: key,
            mv: _.sumBy(d, 'mv'),
            Durn: _.sumBy(d, 'Durn'),
            EEI: _.meanBy(d, 'EEI')
          }))
          .value();

        // const sortedGroup =   _.sortBy(grouped, o => o.Duration).reverse();
        this.v6Chart = new Chart(this.v6Canvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: this.grouped.map(v => v.asset),
            datasets: [
              {
                label: 'Media Value',
                backgroundColor: [
                  this.primarycolr,
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.successcolr,
                  this.dangercolr,
                  this.titlecolr
                ],
                borderColor: [
                  this.primarycolr,
                  this.secondarycolr,
                  this.tertiarycolr,
                  this.successcolr,
                  this.dangercolr,
                  this.titlecolr
                ],
                borderWidth: 1,
                data: this.grouped.map(v => v.mv)
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: false,
              text: 'Assetwise Media Value',
              fontColor: this.titlecolr,
              fontSize: 16
            },
            legend: {
              display: true,
              position: 'right',
              labels: {
              fontColor: this.primarycolr,
            },
            },
            cutoutPercentage: '80'
          }
        });
      });
  }

  getLocationRanks(brandid: string, venueid: string) {
    this.dashboardservice
      .getVenueInfo(this.eventid, brandid, venueid)
      .valueChanges()
      .subscribe(data => {
        let SortedData = [];
        const rankData = data.map(a => ({
          venue: a.venue,
          EEI: Math.round(a.EEI),
          asset: a.Category,
          Q: a.Q,
          P: a.P,
          Share: a.Share
        }));
        this.VenueCount = rankData.length;
        SortedData = _.sortBy(rankData, o => o.EEI).reverse();
        this.EEIRank = SortedData.findIndex(p => p.venue === venueid) + 1;
        SortedData = _.sortBy(rankData, o => o.Q).reverse();
        this.QRank = SortedData.findIndex(p => p.venue === venueid) + 1;
        SortedData = _.sortBy(rankData, o => o.P).reverse();
        this.PRank = SortedData.findIndex(p => p.venue === venueid) + 1;
        SortedData = _.sortBy(rankData, o => o.Share).reverse();
        this.SRank = SortedData.findIndex(p => p.venue === venueid) + 1;
      });
  }
  VenuewiseAssetChart(brandid: string, venueid: string) {
    const barColors = [];
    this.dashboardservice
      .getBrandAssetInfo(this.eventid, brandid, this.selectedVenue)
      .valueChanges()
      .subscribe(data => {
        const EEIData = data.map(a => ({
          EEI: Math.round(a.EEI),
          asset: a.Category,
          id: a.id,
          Durn: a.Durn,
          MV: Math.round((a.EEI * a.Durn * this.tvrate) / (10 * 10000000)),
        }));
        if (this.v2Chart) {
          this.v2Chart.destroy();
        } // destroy previos instances
        this.sortedGroup = _.sortBy(EEIData, o => o.EEI).reverse();
        /*this.sortedGroup.forEach(c => {
          if (c.EEI < this.dangerlimit) {
            barColors.push(this.dangercolr);
          } else if (c.EEI >= 25 && c.EEI < 36) {
            barColors.push(this.warningcolr);
          } else {
            barColors.push(this.successcolr);
          }
        });*/
        const ctx = this.v2Canvas.nativeElement.getContext('2d');
        const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
        gradientStroke.addColorStop(0, '#fff');
        gradientStroke.addColorStop(1, '#fffc00');
        this.v2Chart = new Chart(this.v2Canvas.nativeElement, {
          type: 'bar',
          data: {
            labels: this.sortedGroup.map(v => v.asset),
            datasets: [
              {
                label: 'EEI',
                backgroundColor: this.barcolr,
                borderColor: this.barcolr,
                borderWidth: 1,
                data: this.sortedGroup.map(v => v.EEI),
                // barThickness: 26,  // number (pixels) or 'flex'
                maxBarThickness: 40 // number (pixels)
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
              display: false,
              text: 'Assetwise EEI',
              fontColor: this.primarycolr,
              fontSize: 16
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr
                  },
                  gridLines: {
                    drawBorder: true,
                    drawOnChartArea: false
                  }
                }
              ],
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr,
                    fontSize: 20
                  },
                  gridLines: {
                    drawBorder: true,
                    drawOnChartArea: false
                  }
                }
              ]
            },
            legend: {
              display: false
            }
          }
        });
      });
  }
} // EOF
