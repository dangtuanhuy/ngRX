import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth-guard.service';
import { PageConstants } from './shared/constants/common.constant';
import { DeviceAuthenticationComponent } from './auth/device-authentication/device-authentication.component';
import { SyncDataComponent } from './contents/sync-data/sync-data.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: `/${PageConstants.quickSelect}`,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.quickSelect,
    loadChildren:
      './contents/quick-select/quick-select.module#QuickSelectModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.payment,
    loadChildren: './contents/payment/payment.module#PaymentModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.openDay,
    loadChildren: './contents/open-day/open-day.module#OpenDayModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.closeDay,
    loadChildren: './contents/close-day/close-day.module#CloseDayModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.recentSales,
    loadChildren: './contents/recent-sales/recent-sales.module#RecentSalesModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.pendingSales,
    loadChildren: './contents/pending-sales/pending-sales.module#PendingSalesModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.appSetting,
    loadChildren: './contents/pos-app-setting/pos-app-setting.module#PosAppSettingModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.stockPrice,
    loadChildren: './contents/stock-price/stock-price.module#StockPriceModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.federateSearchStock,
    loadChildren: './contents/federate-search-stock/federate-search-stock.module#FederateSearchStockModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.customerManagement,
    loadChildren: './contents/customer/customer.module#CustomerModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.pickupOrder,
    loadChildren: './contents/pickup-order/pickup-order.module#PickupOrderModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.login,
    component: LoginComponent
  },
  {
    path: PageConstants.deviceAuthentication,
    component: DeviceAuthenticationComponent
  },
  {
    path: PageConstants.syncData,
    component: SyncDataComponent
  },
  {
    path: PageConstants.receipt,
    loadChildren: './contents/receipt/receipt.module#ReceiptModule',
    canActivate: [AuthGuard]
  },
  {
    path: PageConstants.promotion,
    loadChildren: './contents/pos-promotion/pos-promotion.module#PosPromotionModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
