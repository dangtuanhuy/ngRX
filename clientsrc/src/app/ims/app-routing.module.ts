import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/components/auth/auth.guard';
import { Resolver } from './app.resolve';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    resolve: {
      team: Resolver
    }
  },
  {
    path: 'categories',
    loadChildren: './categories/category.module#CategoryModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'brands',
    loadChildren: './brands/brand.module#BrandModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: './products/product.module#ProductModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'locations',
    loadChildren: './locations/location.module#LocationModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'fields',
    loadChildren: './fields/field.module#FieldModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'field-templates',
    loadChildren: './field-templates/field-template.module#FieldTemplateModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'assortments',
    loadChildren: './assortments/assortment.module#AssortmentModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'channels',
    loadChildren: './channels/channel.module#ChannelModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'goods-inward',
    loadChildren: './goods-inwards/goods-inward.module#GoodsInwardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'activities',
    loadChildren: './activities/activity.module#ActivityModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'index',
    loadChildren: './search/search.module#SearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'reasons',
    loadChildren: './reasons/reason.module#ReasonModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'purchase-order',
    loadChildren: './purchaseorder/purchaseorder.module#PurchaseorderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'retail',
    loadChildren: './retail/retail.module#RetailModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'promotion',
    loadChildren: './promotion/promotion.module#PromotionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-request',
    loadChildren: './stock-requests/stock-request.module#StockRequestModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-allocation',
    loadChildren: './allocation-transaction/allocation-transaction.module#AllocationTransactionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'transfer-outs',
    loadChildren: './transfer-out/transfer-out.module#TransferOutModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'transfer-ins',
    loadChildren: './transfer-in/transfer-in.module#TransferInModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report-loading',
    loadChildren: './report-loading/report-loading.module#ReportLoadingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'report-error',
    loadChildren: './report-error/report-error.module#ReportErrorModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-initial',
    loadChildren: './stock-initial/stock-initial.module#StockInitialModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'goods-return',
    loadChildren: './goods-returns/goods-return.module#GoodsReturnModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
