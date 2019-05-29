import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountPromotionComponent } from './discount-promotion.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import {
    reducer as promotionReducer,
    key as promotionKey,
    PromotionState
  } from './state/promotion.reducer';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
  } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PromotionEffects } from './state/promotion.effect';
import { AddDiscountPromotionComponent } from './add-discount-promotion/add-discount-promotion.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UpdatePromotionStatusComponent } from './update-promotion-status/update-promotion-status.component';
import { UpdateDiscountPromotionComponent } from './update-discount-promotion/update-discount-promotion.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const homeRoutes: Routes = [
    { path: '', component: DiscountPromotionComponent },
    { path: 'discount-promotion', component: DiscountPromotionComponent }
  ];

  export interface IPromotionState {
    promotions_reducer: PromotionState;
    listviewmanagement_reducer: ListViewManagementState;
  }

  export const reducers: ActionReducerMap<IPromotionState> = {
    promotions_reducer: promotionReducer,
    listviewmanagement_reducer: listViewManagementReducer
  };

  @NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(homeRoutes),
      StoreModule.forFeature(`promotions`, reducers),
      EffectsModule.forFeature([PromotionEffects]),
      FormsModule,
      ReactiveFormsModule,
      NgSelectModule,
      NgbDropdownModule,
      NgbModule,
      NgxDatatableModule,
      NgMultiSelectDropDownModule
    ],
    declarations: [
        DiscountPromotionComponent,
        AddDiscountPromotionComponent,
        UpdatePromotionStatusComponent,
        UpdateDiscountPromotionComponent
    ],
    entryComponents: [
      AddDiscountPromotionComponent,
      UpdatePromotionStatusComponent,
      UpdateDiscountPromotionComponent
    ],
    providers: [
      DatePipe
    ]
  })
  export class PromotionModule {}
