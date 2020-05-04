import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {PipesModule} from '../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { DashboardAPage } from './dashboard-a.page';
// import { ZoomChartPageModule } from '../zoom-chart/zoom-chart.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardAPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardAPage]
})
export class DashboardAPageModule {}
