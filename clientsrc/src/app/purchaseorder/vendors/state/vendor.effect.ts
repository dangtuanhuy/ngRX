import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as vendorActions from '../state/vendor.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { VendorService } from '../../../shared/services/vendor.service';
import { VendorModel, VendorViewModel, PaymentTermModel, VendorFilterRequestModel } from '../vendor.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { CurrencyModel, TaxTypeModel } from '../../purchase-orders/purchase-order.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

let filterRequest = new VendorFilterRequestModel();

@Injectable()
export class VendorEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private vendorService: VendorService
  ) { }

  @Effect()
  getVendors$: Observable<Action> = this.action$
    .pipe(
      ofType(vendorActions.VendorActionTypes.GetVendors),
      mergeMap((action: vendorActions.GetVendors) =>
        this.vendorService
          .getAll(action.payload.page, action.payload.numberItemsPerPage, action.filterRequest)
          .pipe(
            map((vendors: PagedResult<VendorViewModel>) => {
              this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(vendors));
              filterRequest = action.filterRequest;
              return new vendorActions.GetVendorsSuccess(vendors);
            })
          )
      )
    );

  @Effect()
  getAllVendor$: Observable<Action> = this.action$
    .pipe(
      ofType(vendorActions.VendorActionTypes.GetVendor),
      mergeMap((action: vendorActions.GetVendor) =>
        this.vendorService
          .getBy(action.payload)
          .pipe(map((vendor: VendorModel) => {
            return new vendorActions.GetVendorSuccess(vendor);
          })
          )
      )
    );

  @Effect()
  addVendor$: Observable<Action> = this.action$.pipe(
    ofType(vendorActions.VendorActionTypes.AddVendor),
    map((action: vendorActions.AddVendor) => action.payload),
    mergeMap((vendor: VendorModel) =>
      this.vendorService.add(vendor).pipe(
        map(newVendor => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          filterRequest = new VendorFilterRequestModel();
          this.store.dispatch(new listViewManagementActions.ChangeFilter(null));
          this.store.dispatch(new vendorActions.GetVendors(new PagingFilterCriteria(1, pageSize), filterRequest));
          return new vendorActions.AddVendorSuccess(newVendor);
        }),
        catchError(error => of(new vendorActions.AddVendorFail(error)))
      )
    )
  );

  @Effect()
  updateVendor$: Observable<Action> = this.action$.pipe(
    ofType(vendorActions.VendorActionTypes.UpdateVendor),
    map((action: vendorActions.UpdateVendor) => action.payload),
    mergeMap((vendor: VendorModel) =>
      this.vendorService.update(vendor).pipe(
        map(updatedVendor => {
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());          
          this.store.dispatch(new vendorActions.GetVendors(new PagingFilterCriteria(1, pageSize), filterRequest));
          return new vendorActions.UpdateVendorSuccess(updatedVendor);
        }),
        catchError(error =>
          of(new vendorActions.UpdateVendorFail(error))
        )
      )
    )
  );

  @Effect()
  deleteVendor$: Observable<Action> = this.action$.pipe(
    ofType(vendorActions.VendorActionTypes.DeleteVendor),
    map((action: vendorActions.DeleteVendor) => action.payload),
    mergeMap((id: string) =>
      this.vendorService.remove(id).pipe(
        map(() => {
          this.store.dispatch(new listViewManagementActions.DeleteSucessAction());         
          this.store.dispatch(new vendorActions.GetVendors(new PagingFilterCriteria(1, pageSize), filterRequest));
          return new vendorActions.DeleteVendorSuccess(id);
        }),
        catchError(error =>
          of(new vendorActions.DeleteVendorFail(error))
        )
      )
    )
  );

  @Effect()
    getCurrencies$: Observable<Action> = this.action$
        .pipe(
            ofType(vendorActions.VendorActionTypes.GetCurrencies),
            mergeMap((action: vendorActions.GetCurrencies) =>
                this.vendorService
                    .getCurrencies()
                    .pipe(map((res: Array<CurrencyModel>) => {
                        return new vendorActions.GetCurrenciesSuccess(res);
                    })
                    )
            )
        );

  @Effect()
    getPaymentTerms$: Observable<Action> = this.action$
        .pipe(
            ofType(vendorActions.VendorActionTypes.GetPaymentTerms),
            mergeMap((action: vendorActions.GetPaymentTerms) =>
                this.vendorService
                    .getPaymentTerms()
                    .pipe(map((res: Array<PaymentTermModel>) => {
                        return new vendorActions.GetPaymentTermsSuccess(res);
                    })
                    )
            )
        );
  @Effect()
    getTaxTypes$: Observable<Action> = this.action$
        .pipe(
            ofType(vendorActions.VendorActionTypes.GetTaxTypes),
            mergeMap((action: vendorActions.GetTaxTypes) =>
                this.vendorService
                    .getTaxTypes()
                    .pipe(map((res: Array<TaxTypeModel>) => {
                        return new vendorActions.GetTaxTypesSuccess(res);
                    })
                    )
            )
        );

}
