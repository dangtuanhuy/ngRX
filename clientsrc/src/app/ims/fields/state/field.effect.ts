import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { FieldModel, EntityRefModel } from '../field.model';
import * as fieldActions from '../state/field.action';
import { FieldService } from 'src/app/shared/services/field.service';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class FieldEffects {
    constructor(private action$: Actions,
        private store: Store<any>,
        private fieldService: FieldService) { }

    @Effect()
    getFields$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.GetFields),
        mergeMap((action: fieldActions.GetFields) =>
            this.fieldService
                .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
                .pipe(
                    map(
                        (fields: PagedResult<FieldModel>) => {
                            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(fields));
                            return new fieldActions.GetFieldsSuccess(fields);
                        }
                    )
                )
        )
    );

    @Effect()
    getField$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.GetField),
        mergeMap((action: fieldActions.GetField) =>
            this.fieldService
                .getBy(action.payload)
                .pipe(
                    map(
                        (field: FieldModel) => {
                            return new fieldActions.GetFieldSuccess(field);
                        }
                    )
                )
        )
    );

    @Effect()
    getEntityRefList$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.GetEntityRefList),
        mergeMap((action: fieldActions.GetEntityRefList) =>
            this.fieldService
                .getEntityRefList()
                .pipe(
                    map(
                        (entityRefs: EntityRefModel[]) =>
                            new fieldActions.GetEntityRefListSuccess(entityRefs)
                    )
                )
        )
    );

    @Effect()
    addField$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.AddField),
        map((action: fieldActions.AddField) => action.payload),
        mergeMap((field: FieldModel) =>
            this.fieldService.add(field).pipe(
                map(newField => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new fieldActions.GetFields(new PagingFilterCriteria(1, pageSize), ''));
                    return new fieldActions.AddFieldSuccess(newField);
                }),
                catchError(error => of(new fieldActions.AddFieldFail(error)))
            )
        )
    );

    @Effect()
    updateField$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.UpdateField),
        map((action: fieldActions.UpdateField) => action.payload),
        mergeMap((category: FieldModel) =>
            this.fieldService.update(category).pipe(
                map(updatedField => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new fieldActions.GetFields(new PagingFilterCriteria(1, pageSize), ''));
                    return new fieldActions.UpdateFieldSuccess(updatedField);
                }),
                catchError(error =>
                    of(new fieldActions.UpdateFieldFail(error))
                )
            )
        )
    );


    @Effect()
    deleteCategory$: Observable<Action> = this.action$.pipe(
        ofType(fieldActions.FieldActionTypes.DeleteField),
        map((action: fieldActions.DeleteField) => action.payload),
        mergeMap((id: string) =>
            this.fieldService.remove(id).pipe(
                map((result) => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new fieldActions.GetFields(new PagingFilterCriteria(1, pageSize), ''));
                    return new fieldActions.DeleteFieldSuccess(id);
                }),
                catchError(error =>
                    of(new fieldActions.DeleteFieldFail(error))
                )
            )
        )
    );
}
