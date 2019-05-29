import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { StoresComponent } from './stores.component';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import {
  reducer as storeReducer,
  key as storeKey,
  StoreState
} from './state/store.reducer';
import { reducer as listViewManagementReducer } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ExportSaleTransactionComponent } from './export/export.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreEffects } from './state/store.effect';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExportCsvComponent } from './export-csv/export-csv.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StoreSettingGenerationComponent } from './store-setting-generation/store-setting-generation.component';

const homeRoutes: Routes = [{ path: '', component: StoresComponent },
{ path: 'export', component: ExportSaleTransactionComponent },
{ path: 'generate-store-settings', component: StoreSettingGenerationComponent }
];

export interface IStoreState {
  stores_reducer: StoreState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IStoreState> = {
  stores_reducer: storeReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(`stores`, reducers),
    EffectsModule.forFeature([StoreEffects]),
    RouterModule.forChild(homeRoutes),
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbModule,
    NgxDatatableModule
  ],
  declarations: [
    ExportSaleTransactionComponent,
    StoresComponent,
    UpdateStoreComponent,
    ExportCsvComponent,
    StoreSettingGenerationComponent
  ],
  entryComponents: [UpdateStoreComponent, ExportCsvComponent]
})
export class StoresModule { }
