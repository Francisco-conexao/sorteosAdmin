import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

import { LoginGuard } from './guards/login.guard';
import { HomeGuard } from './guards/home.guard';
import { DashboardGuard } from './guards/dashboard.guard';
import { LoginComponent } from './login/login.component';
import { LoginModule } from './login/login.module';

const routes: Routes = [
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [HomeGuard],
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [DashboardGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
