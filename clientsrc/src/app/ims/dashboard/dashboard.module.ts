import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
    reducer as listViewManagementReducer,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

const dashboardRoutes: Routes = [{ path: '', component: DashboardComponent }];

export interface IDashboardState {
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IDashboardState> = {
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(dashboardRoutes),
        StoreModule.forFeature(`dashboard`, reducers),
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        NgxDatatableModule,
        BootstrapModule
    ],
    declarations: [DashboardComponent],
    entryComponents: []
})
export class DashboardModule { }
