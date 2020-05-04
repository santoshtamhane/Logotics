import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {PipesModule} from '../../pipes/pipes.module';
import { DashboardBPage } from './dashboard-b.page';
import { NgxGaugeModule } from 'ngx-gauge';
const routes: Routes = [
  {
    path: '',
    component: DashboardBPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NgxGaugeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardBPage]
})
export class DashboardBPageModule {}
