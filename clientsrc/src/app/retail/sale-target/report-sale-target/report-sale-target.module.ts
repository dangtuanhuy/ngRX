import { Routes, RouterModule } from '@angular/router';
import { ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { reducer as saleTargetReducer, SaleTargetState } from '../state/sale-target.reducer';
import { reducer as listViewManagementReducer } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SaleTargetEffects } from '../state/sale-target.effect';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportSaleTargetComponent } from '../report-sale-target/report-sale-target.component';

const homeRoutes: Routes = [ {path: '', component: ReportSaleTargetComponent}];

export interface IStoreState {
    sale_target_reducer: SaleTargetState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IStoreState> = {
    sale_target_reducer: saleTargetReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      StoreModule.forFeature(`sale-target`, reducers),
      EffectsModule.forFeature([SaleTargetEffects]),
      RouterModule.forChild(homeRoutes),
      NgbModule.forRoot(),
      ReactiveFormsModule,
      NgSelectModule,
      FormsModule,
      NgxDatatableModule,
      BootstrapModule
    ],
    declarations: [
        ReportSaleTargetComponent,
    ],
  })
export class ReportSaleTargetModule { }
