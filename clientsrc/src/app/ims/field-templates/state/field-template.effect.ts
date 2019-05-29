import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FieldService } from 'src/app/shared/services/field.service';
import { AppSettingService } from 'src/app/shared/services/appsetting.service';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AppSettingModel } from 'src/app/shared/base-model/appsetting.model';
import { FieldModel } from '../../fields/field.model';
import { FieldTemplateService } from 'src/app/shared/services/field-template.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { FieldTemplateModel } from '../field-template.model';
import * as fieldTemplateActions from '../state/field-template.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class FieldTemplateEffects {
    constructor(private action$: Actions,
        private fieldService: FieldService,
        private appSettingService: AppSettingService,
        private fieldTemplateService: FieldTemplateService,
        private productService: ProductService,
        private store: Store<any>) { }


    @Effect()
    getFieldTemplates$: Observable<Action> = this.action$.pipe(
        ofType(fieldTemplateActions.FieldTemplateActionTypes.GetFieldTemplates),
        mergeMap((action: fieldTemplateActions.GetFieldTemplates) =>
            this.fieldTemplateService
                .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
                .pipe(map((fieldTemplateModels: PagedResult<FieldTemplateModel>) => {
                    this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(fieldTemplateModels));
                    return new fieldTemplateActions.GetFieldTemplatesSuccess(fieldTemplateModels);
                })
                )
        )
    );

    @Effect()
    getFields$: Observable<Action> = this.action$.pipe(
        ofType(fieldTemplateActions.FieldTemplateActionTypes.GetFields),
        mergeMap((action: fieldTemplateActions.GetFields) => this.fieldService.getAllFields().pipe(
            map((fields: FieldModel[]) => (new fieldTemplateActions.GetFieldsSuccess(fields)))
        ))
    );

    @Effect()
    addFieldTemplate$: Observable<Action> = this.action$.pipe(
        ofType(fieldTemplateActions.FieldTemplateActionTypes.AddFieldTemplate),
        map((action: fieldTemplateActions.AddFieldTemplate) => action.payload),
        mergeMap((fieldTemplate: FieldTemplateModel) =>
            this.fieldTemplateService.add(fieldTemplate).pipe(
                map(result => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new fieldTemplateActions.GetFieldTemplates(new PagingFilterCriteria(1, pageSize), ''));
                    return (new fieldTemplateActions.AddFieldTemplateSuccess(result));
                }),
                catchError(error => of(new fieldTemplateActions.AddFieldTemplateFail(error)))
            ))
    );

    @Effect()
    updateFieldTemplate$: Observable<Action> = this.action$.pipe(
        ofType(fieldTemplateActions.FieldTemplateActionTypes.UpdateFieldTemplate),
        map((action: fieldTemplateActions.UpdateFieldTemplate) => action.payload),
        mergeMap((fieldTemplate: FieldTemplateModel) =>
            this.fieldTemplateService.update(fieldTemplate).pipe(
                map(updatedFieldTemplate => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new fieldTemplateActions.GetFieldTemplates(new PagingFilterCriteria(1, pageSize), ''));
                    return (new fieldTemplateActions.UpdateFieldTemplateSuccess(updatedFieldTemplate));
                }),
                catchError(error =>
                    of(new fieldTemplateActions.UpdateFieldTemplateFail(error))
                )
            ))
    );

    @Effect()
    deleteFieldTemplate$: Observable<Action> = this.action$.pipe(
        ofType(fieldTemplateActions.FieldTemplateActionTypes.DeleteFieldTemplate),
        map((action: fieldTemplateActions.DeleteFieldTemplate) => action.payload),
        mergeMap((id: string) =>
            this.fieldTemplateService.remove(id).pipe(
                map(result => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new fieldTemplateActions.GetFieldTemplates(new PagingFilterCriteria(1, pageSize), ''));
                    return (new fieldTemplateActions.DeleteFieldTemplateSuccess(id));
                }),
                catchError(error =>
                    of(new fieldTemplateActions.DeleteFieldTemplateFail(error))
                )
            ))
    );
}
