import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AppSettingService } from 'src/app/shared/services/appsetting.service';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as promotionActions from '../state/promotion.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { LocationModel, TypeModel, PromotionModel, CouponCodeModel } from '../../promotion.model';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PromotionService } from '../../promotion.service';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class PromotionEffects {
    constructor(private action$: Actions,
        private appSettingService: AppSettingService,
        private store: Store<any>,
        private promotionService: PromotionService) { }

    @Effect()
    getPromotions$: Observable<Action> = this.action$
        .pipe(
            ofType(promotionActions.PromotionActionTypes.GetPromotions),
            mergeMap((action: promotionActions.GetPromotions) =>
                this.promotionService
                    .getPromotions(action.payload.page, action.payload.numberItemsPerPage)
                    .pipe(map((promotions: PagedResult<PromotionModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(promotions));
                        return new promotionActions.GetPromotionsSuccess(promotions);
                    })
                    )
            )
        );

    @Effect()
    getLocations$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetLocations),
        mergeMap((action: promotionActions.GetLocations) =>
            this.promotionService
                .getAllLocationWithoutPaging()
                .pipe(
                    map((locations: LocationModel[]) => {
                        return new promotionActions.GetLocationsSuccess(locations);
                    }
                    )
                )
        )
    );

    @Effect()
    getPromotionTypes$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetPromotionTypes),
        mergeMap((action: promotionActions.GetPromotionTypes) =>
            this.promotionService
                .getAllPromotionTypes()
                .pipe(
                    map((promotionTypes: TypeModel[]) => {
                        return new promotionActions.GetPromotionTypesSuccess(promotionTypes);
                    }
                    )
                )
        )
    );

    @Effect()
    getDiscountTypes$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetDiscountTypes),
        mergeMap((action: promotionActions.GetDiscountTypes) =>
            this.promotionService
                .getAllDiscountTypes()
                .pipe(
                    map((discountTypes: TypeModel[]) => {
                        return new promotionActions.GetDiscountTypesSuccess(discountTypes);
                    }
                    )
                )
        )
    );

    @Effect()
    getConditionTypes$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetConditionTypes),
        mergeMap((action: promotionActions.GetConditionTypes) =>
            this.promotionService
                .getAllConditionTypes()
                .pipe(
                    map((conditionTypes: TypeModel[]) => {
                        return new promotionActions.GetConditionTypesSuccess(conditionTypes);
                    }
                    )
                )
        )
    );

    @Effect()
    getOperatorTypes$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetOperatorTypes),
        mergeMap((action: promotionActions.GetOperatorTypes) =>
            this.promotionService
                .getAllOperatorTypes()
                .pipe(
                    map((operatorTypes: TypeModel[]) => {
                        return new promotionActions.GetOperatorTypesSuccess(operatorTypes);
                    }
                    )
                )
        )
    );

    @Effect()
    getCouponCodes$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.GetCouponCodes),
        mergeMap((action: promotionActions.GetCouponCodes) =>
            this.promotionService
                .getAllCouponCodes()
                .pipe(
                    map((couponCodes: CouponCodeModel[]) => {
                        return new promotionActions.GetCouponCodesSuccess(couponCodes);
                    })
                )
        )
    );

    @Effect()
    addPromotion$: Observable<Action> = this.action$
        .pipe(
            ofType(promotionActions.PromotionActionTypes.AddPromotion),
            map((action: promotionActions.AddPromotion) => action.payload),
            mergeMap((promotion: PromotionModel) =>
                this.promotionService.add(promotion).pipe(
                    map(newPromotion => {
                        this.store.dispatch(new listViewManagementActions.AddSucessAction());
                        this.store.dispatch(new promotionActions.GetPromotions(new PagingFilterCriteria(1, pageSize)));
                        return new promotionActions.AddPromotionSuccess(newPromotion);
                    }),
                    catchError(error => of(new promotionActions.AddPromotionFail(error)))
                )
            )
        );

    @Effect()
    updatePromotionStatus$: Observable<Action> = this.action$.pipe(
        ofType(promotionActions.PromotionActionTypes.UpdatePromotionStatus),
        map((action: promotionActions.UpdatePromotionStatus) => action.payload),
        mergeMap((data: any) =>
            this.promotionService.updateStatus(data.id, data.status).pipe(
                map(updatedPromotionStatus => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new promotionActions.GetPromotions(new PagingFilterCriteria(1, pageSize)));
                    return new promotionActions.UpdatePromotionStatusSuccess(updatedPromotionStatus);
                }),
                catchError(error =>
                    of(new promotionActions.UpdatePromotionStatusFail(error))
                )
            )
        )
    );

    @Effect()
    updatePromotion$: Observable<Action> = this.action$
        .pipe(
            ofType(promotionActions.PromotionActionTypes.UpdatePromotion),
            map((action: promotionActions.UpdatePromotion) => action.payload),
            mergeMap((promotion: PromotionModel) =>
                this.promotionService.update(promotion).pipe(
                    map(updatedPromotion => {
                        this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                        this.store.dispatch(new promotionActions.GetPromotions(new PagingFilterCriteria(1, pageSize)));
                        return new promotionActions.UpdatePromotionSuccess(updatedPromotion);
                    }),
                    catchError(error => of(new promotionActions.UpdatePromotionFail(error)))
                )
            )
        );
}
