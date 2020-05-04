import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'password-reset', loadChildren: './pages/password-reset/password-reset.module#PasswordResetPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'home:userid', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  /* { path: 'dashboard-a:eventid:event:date', loadChildren: './pages/dashboard-a/dashboard-a.module#DashboardAPageModule',
   canActivate: [AuthGuard] },
   { path: 'dashboard-a:eventid:event:date:ikey', loadChildren: './pages/dashboard-a/dashboard-a.module#DashboardAPageModule',
   canActivate: [AuthGuard] },
  { path: 'dashboard-a', loadChildren: './pages/dashboard-a/dashboard-a.module#DashboardAPageModule'
  , canActivate: [AuthGuard] },*/
  { path: 'dashboard-b', loadChildren: './pages/dashboard-b/dashboard-b.module#DashboardBPageModule'
  , canActivate: [AuthGuard] },
  { path: 'dashboard-b:eventid:event:Date:venue:brand:tvrate:logo:ikey',
   loadChildren: './pages/dashboard-b/dashboard-b.module#DashboardBPageModule'
  , canActivate: [AuthGuard] },
  { path: 'dashboard-c', loadChildren: './pages/dashboard-c/dashboard-c.module#DashboardCPageModule'
  , canActivate: [AuthGuard] },
  { path: 'dashboard-c:eventid:event:Date:asset:brand:tvrate:logo:ikey',
   loadChildren: './pages/dashboard-c/dashboard-c.module#DashboardCPageModule'
  , canActivate: [AuthGuard] },
  { path: 'event-dashboard', loadChildren: './pages/event-dashboard/event-dashboard.module#EventDashboardPageModule'
, canActivate: [AuthGuard]  },
  { path: 'event-dashboard:userid:eventid:event:date:ikey', loadChildren: './pages/dashboard-a/dashboard-a.module#DashboardAPageModule',
   canActivate: [AuthGuard] },
  { path: 'brand-list', loadChildren: './pages/brand-list/brand-list.module#BrandListPageModule', canActivate: [AuthGuard]  },
  { path: 'brand-dashboard', loadChildren: './pages/brand-dashboard/brand-dashboard.module#BrandDashboardPageModule', 
  canActivate: [AuthGuard]  },
  { path: 'brand-dashboard:brandid', loadChildren: './pages/brand-dashboard/brand-dashboard.module#BrandDashboardPageModule', 
  canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
