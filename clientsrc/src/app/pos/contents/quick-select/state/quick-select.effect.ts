import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as quickSelectsActions from './quick-select.action';
import { mergeMap, map } from 'rxjs/operators';
import { CategoryService } from 'src/app/pos/shared/services/category.service';
import { Category } from 'src/app/pos/shared/models/category';
import { VariantService } from 'src/app/pos/shared/services/variant.service';
import { CategoryPagingModel } from 'src/app/pos/shared/view-models/category-paging.model';
import { VariantPagingModel } from 'src/app/pos/shared/view-models/variant-paging.model';

@Injectable()
export class QuickSelectEffects {
    constructor(
        private action$: Actions,
        private categoryService: CategoryService,
        private variantService: VariantService,
    ) { }

    @Effect()
    getCategoriesPaging$: Observable<Action> = this.action$.pipe(
        ofType(quickSelectsActions.QuickSelectActionTypes.GetCategoriesPaging),
        mergeMap((action: any) => this.categoryService.getPaging(action.payload.pageIndex, action.payload.pageSize).pipe(
            map((categoryPagingModel: CategoryPagingModel) => (new quickSelectsActions.GetCategoriesPagingSuccess(categoryPagingModel)))
        ))
    );

    @Effect()
    getVariantsByCategoriesPaging$: Observable<Action> = this.action$.pipe(
        ofType(quickSelectsActions.QuickSelectActionTypes.GetVariantsByCategoriesPaging),
        mergeMap((action: any) =>
            this.variantService.getByCategoriesPaging(action.payload.categoryIds, action.payload.locationId
                , action.payload.pageIndex, action.payload.pageSize)
                .pipe(
                    map((variantPagingModel: VariantPagingModel) =>
                        (new quickSelectsActions.GetVariantsByCategoriesPagingSuccess(variantPagingModel)))
                ))
    );
}
