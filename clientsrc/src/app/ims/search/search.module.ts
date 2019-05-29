import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { IndexComponent } from './index.component';
import {
    reducer as searchReducer,
    key as searchKey,
    SearchState
} from './state/search.reducer';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from './state/search.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const searchRoutes: Routes = [{ path: '', component: IndexComponent }];

export interface ISearchState {
    search_reducer: SearchState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<ISearchState> = {
    search_reducer: searchReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(searchRoutes),
        StoreModule.forFeature(`search`, reducers),
        EffectsModule.forFeature([SearchEffects]),
        ReactiveFormsModule,
        NgSelectModule
    ],
    declarations: [IndexComponent],
    entryComponents: []
})
export class SearchModule { }
