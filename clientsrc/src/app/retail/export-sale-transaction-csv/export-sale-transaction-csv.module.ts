import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { ExportSaleTransactionCSVComponent } from './export-sale-transaction-csv';

const homeRoutes: Routes = [ {path: '', component: ExportSaleTransactionCSVComponent}];

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
        ExportSaleTransactionCSVComponent,
    ],
  })
export class ExportSaleTransactionCSVModule { }
