import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/components/auth/auth.guard';
import { AppComponent } from './app.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/vendors',
    pathMatch: 'full'
  },
  {
    path: 'vendors',
    loadChildren: './vendors/vendor.module#VendorModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'purchase-orders',
    loadChildren: './purchase-orders/purchase-order.module#PurchaseOrderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'return-orders',
    loadChildren: './purchase-orders/return-order.module#ReturnOrderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'approvals',
    loadChildren: './approvals/approval.module#ApprovalModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ims',
    loadChildren: './ims/ims.module#PurchaseImsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report-loading',
    loadChildren: './report-loading/report-loading.module#PurchaseOrderReportLoadingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report-error',
    loadChildren: './report-error/report-error.module#PurchaseOrderReportErrorModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/vendors'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
