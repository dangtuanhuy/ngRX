import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/components/auth/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/retail',
    pathMatch: 'full'
  },
  {
    path: 'retail',
    loadChildren: './stores/stores.module#StoresModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'devices',
    loadChildren: './devices/device.module#DeviceModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'sale-target',
    loadChildren: './sale-target/sale-target.module#SaleTargetModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadChildren: './sale-target/report-sale-target/report-sale-target.module#ReportSaleTargetModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report-sale-performance',
    loadChildren: './sale-performance/sale-performance.module#ReportSalePerformanceModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ims',
    loadChildren: './ims/ims.module#RetailImsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'export-sale-transaction-csv',
    loadChildren: './export-sale-transaction-csv/export-sale-transaction-csv.module#ExportSaleTransactionCSVModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/retail'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
