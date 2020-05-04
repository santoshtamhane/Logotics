import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {PipesModule} from '../../pipes/pipes.module';
import { DashboardCPage } from './dashboard-c.page';
import { NgxGaugeModule } from 'ngx-gauge';
const routes: Routes = [
  {
    path: '',
    component: DashboardCPage
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
  declarations: [DashboardCPage]
})
export class DashboardCPageModule {}
