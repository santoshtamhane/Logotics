import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {DashboardService} from '../../services/dashboard.service';
import { Router, ActivatedRoute} from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import * as _ from 'lodash';
import addDays from 'date-fns/addDays';

@Component({
  selector: 'app-dashboard-c',
  templateUrl: './dashboard-c.page.html',
  styleUrls: ['./dashboard-c.page.scss'],
})
export class DashboardCPage implements OnInit {
  @ViewChild('trendCanvas', null) trendCanvas: ElementRef;
  @ViewChild('trendCanvas2', null) trendCanvas2: ElementRef;
  @ViewChild('vCanvas', null) vCanvas: ElementRef;
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
  assetList: Observable<any>;
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
  primarycolr = '#28383c'; // '#4fc1e9';
  secondarycolr = '#fd625e'; // '#48cfad';
  primarycolrtrans = '#28383cbd'; // '#4fc1e9';
  secondarycolrtrans = '#fd625ebd'; // '#48cfad';
  titlecolr = '#5da5da';
  barcolr = '#01b8aa';
  barcolrtrans = '#01b8aa5e';
  axescolr = '#28383c';
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
  AssetCount: number;
  selectedAsset: string;
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
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService,
              private dashboardservice: DashboardService,
              private menuCtrl: MenuController, public navCtrl: NavController) {
                this.eventid = this.route.snapshot.paramMap.get('eventid');
                this.event = this.route.snapshot.paramMap.get('event');
                this.eventdt = this.route.snapshot.paramMap.get('Date');
                this.selectedVenue = this.route.snapshot.paramMap.get('venue');
                this.selectedBrand = this.route.snapshot.paramMap.get('brand');
                this.selectedAsset = this.route.snapshot.paramMap.get('asset');
                this.tvrate = parseFloat(this.route.snapshot.paramMap.get('tvrate'));
                this.logo = this.route.snapshot.paramMap.get('logo');
                this.ikey = this.route.snapshot.paramMap.get('ikey');
                // this.brandList = this.dashboardservice.getBrandList(this.eventid).valueChanges();
                this.venueList = this.dashboardservice.getVenuesList(this.eventid).valueChanges();
                this.assetList = this.dashboardservice.getAssetInfo(this.eventid, this.selectedBrand, this.eventdt).valueChanges();
              }

  ngOnInit() {
    this.getAssetMetrics(this.selectedBrand, this.selectedAsset);
    // this.getEEI_BoxPlot(this.selectedBrand, this.selectedVenue);
    this.AssetwiseVenueChart(this.selectedBrand, this.selectedAsset);
    this.getAssetRanks(this.selectedBrand, this.selectedAsset);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedAsset);
  }

  randomValues(count, min, max) {
    const delta = max - min;
    return Array.from({length: count}).map(() => Math.random() * delta + min);
  }

  changeAsset(asset: string) {
    this.selectedAsset = asset;
    this.getAssetMetrics(this.selectedBrand, this.selectedAsset);
    this.AssetwiseVenueChart(this.selectedBrand, this.selectedAsset);
    this.assetmediavalueDGChart(this.selectedBrand, this.selectedAsset);
    this.getAssetRanks(this.selectedBrand, this.selectedAsset);
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

getAssetMetrics(brandid: string, asset: string) {
  this.dashboardservice.getAssetsbyBrand(this.eventid, brandid, asset).valueChanges()
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


infoEEI() {
  this.seeinfoEEI = !this.seeinfoEEI;
  if (!this.seeinfoEEI) {
    // this.getEEI_BoxPlot(this.selectedBrand, this.selectedVenue);
    }
}

setRate() {
  this.seeRate = !this.seeRate;
  if (!this.seeRate) {
    this.AssetwiseVenueChart(this.selectedBrand, null);
  }
}

setAsset() {
  this.seeAsset = !this.seeAsset;
  if (!this.seeAsset) {
    this.AssetwiseVenueChart(this.selectedBrand, null);
  }
}

checktopVenue() {
  this.seetopVenue = !this.seetopVenue;
}

changeVenueViewBk() {

}
changeVenueViewFwd() {

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
getAssetRanks(brandid: string, asset: string) {
  this.dashboardservice.getAssetInfo(this.eventid, brandid, asset).valueChanges()
  .subscribe(data => {
    let SortedData = [];
    const rankData = data.map(a => ({venue: a.venue, EEI: Math.round(a.EEI), asset: a.Category, Q: a.Q, P: a.P, Share: a.Share}));
    this.AssetCount = rankData.length;
    SortedData = _.sortBy(rankData, o => o.EEI).reverse();
    this.EEIRank = SortedData.findIndex(p => p.asset === asset) + 1;
    SortedData = _.sortBy(rankData, o => o.Q).reverse();
    this.QRank = SortedData.findIndex(p => p.asset === asset) + 1;
    SortedData = _.sortBy(rankData, o => o.P).reverse();
    this.PRank = SortedData.findIndex(p => p.asset === asset) + 1;
    SortedData = _.sortBy(rankData, o => o.Share).reverse();
    this.SRank = SortedData.findIndex(p => p.asset === asset) + 1;
  });

}
assetmediavalueDGChart(brandid: string, asset: string) {
  this.dashboardservice.getVenuesbyAsset(this.eventid, brandid, asset, this.eventdt)
    .valueChanges().subscribe(data => {
      const mVData = data.map(a => ({
        mv: Math.round((a.EEI * a.Durn * this.tvrate) / (10 * 10000000)),
        asset: a.Category,
        venue: a.venue,
        EEI: a.EEI,
        Durn: a.Durn
      }));
      this.grouped = _(mVData)
        .groupBy('venue')
        .map((d, key) => ({
          venue: key,
          mv: _.sumBy(d, 'mv'),
          Durn: _.sumBy(d, 'Durn'),
          EEI: _.meanBy(d, 'EEI')
        }))
        .value();
      const sortedGroup =   _.sortBy(this.grouped, o => o.mv).reverse();
      const ctx = this.v6Canvas.nativeElement.getContext('2d');
      const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
      gradientStroke.addColorStop(0, '#fff');
      gradientStroke.addColorStop(1, '#e48300');
      this.v6Chart = new Chart(this.v6Canvas.nativeElement, {
        overlayBars: false,
        datasetFill: true,
        type: 'bar',
        data: {
          labels: sortedGroup.map(v => v.venue) ,
          datasets: [
            {
              label: 'Media Value Equivalent',
              backgroundColor: this.barcolrtrans,
              borderColor: this.barcolrtrans,
              data: sortedGroup.map(v => v.mv),
              yAxesGroup: '1',

              // yAxisID: 'y-axis-1'
            },

            {
              label: 'EEI',
              backgroundColor: this.secondarycolr,
              borderColor: this.secondarycolr,
                borderWidth: 2,
                pointRadius: 2.5,
              data: sortedGroup.map(v => v.EEI),

              type: 'line',
              yAxesGroup: '2',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
            fontColor: this.primarycolr,
            fontSie: 20
            }
          },
          title: {
            display: false,
            text: 'Venue wise Media Value',
            fontColor: this.barcolr,
            fontSize: 16
          },
          scales: {
            yAxes: [{
              name: '1',
                position: 'left',
                ticks: {
                    beginAtZero: true,
                    fontColor: this.barcolr
                },
                gridLines: {
                  drawBorder: true,
                  drawOnChartArea: false
                },
            },
            {name: '2',
            position: 'right',
            ticks: {
              beginAtZero: true,
              fontColor: this.secondarycolr
          },
          gridLines: {
            drawBorder: true,
            drawOnChartArea: false
          },
          }
          ],
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: this.axescolr,
                fontSize: 20
            },
              gridLines: {
                drawBorder: true,
                drawOnChartArea: false,
              }
            }]
        }
        }
    });
  });
}
AssetwiseVenueChart(brandid: string, asset: string) {
  this.dashboardservice.getVenuesbyAsset(this.eventid, brandid, asset, this.eventdt)
    .valueChanges().subscribe(data => {

      const EEIData = data.map(a => ({EEI: Math.round(a.EEI), venue: a.venue}));
      this.sortedGroup =   _.sortBy(EEIData, o => o.EEI).reverse();
      const ctx = this.v2Canvas.nativeElement.getContext('2d');
      const gradientStroke = ctx.createLinearGradient(0, 0, 0, 100);
      gradientStroke.addColorStop(0, '#fff');
      gradientStroke.addColorStop(1, '#e48300');
      if (this.v2Chart) { this.v2Chart.destroy(); } // destroy previos instances
      this.v2Chart = new Chart(this.v2Canvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.sortedGroup.map(v => v.venue) ,
          datasets: [
            {
              label: 'Exposure Effectiveness Rank',
              backgroundColor: this.barcolrtrans,
              data: this.sortedGroup.map(v => v.EEI)
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          title: {
            display: false,
            text: 'Venue wise Exposure Effectiveness',
            fontColor: this.barcolr,
            fontSize: 16
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: this.axescolr,
                },
                gridLines: {
                  drawBorder: true,
                  drawOnChartArea: false
                },
            }],
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: this.axescolr,
                fontSize: 20
            },
              gridLines: {
                drawBorder: true,
                drawOnChartArea: false,
              }
            }]
        }
        }
    });
  });
}
} // EOF
