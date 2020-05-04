import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {PipesModule} from '../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { NgxGaugeModule } from 'ngx-gauge';

import { EventDashboardPage } from './event-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: EventDashboardPage
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
  declarations: [EventDashboardPage]
})
export class EventDashboardPageModule {}
