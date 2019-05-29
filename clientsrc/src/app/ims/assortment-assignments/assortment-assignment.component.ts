import { Component, Injector } from '@angular/core';
import { AssignmentService } from 'src/app/shared/services/assignment.service';
import * as fromAssortment from '../assortments/state/assortment.reducer';
import * as fromAssortmentAssignment from './state/assortment-assignment.reducer';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import * as assortmentAssignmentActions from './state/assortment-assignment.action';
import * as assortmentSelector from '../assortments/state/index';
import * as assortmentActions from '../assortments/state/assortment.action';
import { AssignmentModel } from 'src/app/shared/base-model/assignment.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { AssortmentModel } from '../assortments/assortment.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    templateUrl: './assortment-assignment.component.html'
})

export class AssortmentAssignmentComponent extends ComponentBase {

    data: Array<AssignmentModel> = [];
    assortment: AssortmentModel;
    assortmentId: string;
    componentActive = true;
    title = 'Assortment Assignment';
    dragTitle = 'Categories';
    public addSuccessMessage = 'Assignment is added.';

    constructor(private activeModal: NgbActiveModal,
        private notificationService: NotificationService,
        private assortmentAssignmentService: AssignmentService,
        private store: Store<fromAssortmentAssignment.AssortmentAssignmentState>,
        private storeAssortment: Store<fromAssortment.AssortmentState>,
        public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.handleSubscription(this.storeAssortment.pipe(
            select(assortmentSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.store.dispatch(new assortmentActions.GetAssortment(id));
                    this.store.dispatch(new assortmentAssignmentActions.GetAssortmentAssignmentSelected(id));
                }
            ));

        this.handleSubscription(this.storeAssortment.pipe(
            select(assortmentSelector.getAssortment), takeWhile(() => this.componentActive))
            .subscribe(
                (assortment: AssortmentModel) => {
                    if (assortment == null) {
                        return;
                    }
                    this.assortment = assortment;
                    this.store.dispatch(new assortmentAssignmentActions.GetAssortmentAssignmentSuccess(this.assortment));
                }));

    }

    onDestroy() {

    }

    searchName(event) {
        if (event) {
            this.store.dispatch(new assortmentAssignmentActions.GetAssortmentAssignmentByName(event));
        } else {
            this.store.dispatch(new assignmentActions.SearchAssignmentAction([]));
        }
    }

    addAssignment(items) {
        if (items) {
            this.assortmentAssignmentService.addAssortmentAssignment(items, this.assortment.id).subscribe(result => {
                if (result) {
                    this.onClose();
                    this.notificationService.success(this.addSuccessMessage);
                    this.store.dispatch(new assortmentAssignmentActions.ResetAssortmentAssignment());
                    this.store.dispatch(new assignmentActions.ResetAssignmentAction());
                }
            });
        }
    }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onCancel(event) {
        this.store.dispatch(new assortmentAssignmentActions.ResetAssortmentAssignment());
        this.store.dispatch(new assignmentActions.ResetAssignmentAction());
    }
}
