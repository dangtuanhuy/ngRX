import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AssignmentService } from 'src/app/shared/services/assignment.service';
import * as assortmentassignmentActions from './assortment-assignment.action';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class AssortmentAssignmentEffects {
  constructor(
    private action$: Actions,
    private assignmentService: AssignmentService
  ) { }

  @Effect()
  getAssortmentsByName$ = this.action$
    .pipe(
      ofType(assortmentassignmentActions.AssortmentActionTypes.GetAssortmentAssignmentByName),
      mergeMap((action: assortmentassignmentActions.GetAssortmentAssignmentByName) =>
        this.assignmentService
          .getByName(action.payload)
          .pipe(map((assortments: any) => {
            return new assignmentActions.SearchAssignmentAction(assortments);
          })
          )
      )
    );

  @Effect()
  getAllAssortments$ = this.action$
    .pipe(
      ofType(assortmentassignmentActions.AssortmentActionTypes.GetAllAssortmentAssignment),
      mergeMap((action: assortmentassignmentActions.GetAllAssortmentAssignment) =>
        this.assignmentService
          .getAllAssortmentAssignemt()
          .pipe(map((assortments: any) => {
            return new assignmentActions.SearchAssignmentAction(assortments);
          })
          )
      )
    );


  @Effect()
  getAssortmentsSelected$ = this.action$
    .pipe(
      ofType(assortmentassignmentActions.AssortmentActionTypes.GetAssortmentAssignmentSelected),
      mergeMap((action: assortmentassignmentActions.GetAssortmentAssignmentSelected) =>
        this.assignmentService
          .getAssortmentAssignemtSelected(action.payload)
          .pipe(map((assortments: any) => {
            return new assignmentActions.GetSelectAssignmentSucessAction(assortments);
          })
          )
      )
    );
}
