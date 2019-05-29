import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/components/auth/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/discount-promotion',
    pathMatch: 'full'
  },
  {
    path: 'discount-promotion',
    loadChildren: './discount-promotion/discount-promotion.module#PromotionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ims',
    loadChildren: './ims/ims.module#PromotionImsModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/discount-promotion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
