import { NgModule } from '@angular/core';
import { SalePerformanceComponent } from './sale-performance.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const homeRoutes: Routes = [ {path: '', component: SalePerformanceComponent}];

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(homeRoutes),
      NgbModule.forRoot(),
      ReactiveFormsModule,
      NgSelectModule,
      FormsModule,
      BootstrapModule
    ],
    declarations: [
        SalePerformanceComponent,
    ],
  })
export class ReportSalePerformanceModule { }
