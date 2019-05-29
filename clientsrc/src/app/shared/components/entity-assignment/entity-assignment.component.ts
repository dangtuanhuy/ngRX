import { Component, Output, EventEmitter, Input, Injector } from '@angular/core';
import * as assignmentSelector from './state/index';
import * as assignmentActions from './state/entity-assignment.action';
import * as fromState from './state/entity-assignment.reducer';
import { Store, select } from '@ngrx/store';
import { ComponentBase } from '../component-base';
import { map, takeWhile } from 'rxjs/operators';
import { AssignmentModel, AddAssignmentModel } from '../../base-model/assignment.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-entity-assignment',
    templateUrl: './entity-assignment.component.html',
    styleUrls: ['./entity-assignment.component.scss'],
})

export class EntityAssignmentComponent extends ComponentBase {
    @Output() searchName = new EventEmitter<any>();
    @Output() seletectAssignments = new EventEmitter<AddAssignmentModel[]>();
    @Output() closeModal = new EventEmitter<any>();
    @Input() data: any;
    @Input() title: string;
    @Input() dragTitle: string;
    text = '';
    droppedItems = [];
    selectItems = [];
    componentActive = true;

    constructor(private store: Store<fromState.AssignmentState>,
        private modalService: NgbModal,
        public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.handleSubscription(
            this.store.pipe(select(assignmentSelector.getSearchAssignment), takeWhile(() => this.componentActive)).subscribe(
                (result) => {
                    if (result != null) {
                        this.data = result;
                    }
                }
            ));
        this.handleSubscription(
            this.store.pipe(select(assignmentSelector.getSelectAssignment), takeWhile(() => this.componentActive)).subscribe(
                (result) => {
                    if (result != null) {
                        this.droppedItems = result;
                    }
                }
            ));
    }
    onDestroy() {

    }

    onItemDrop(event: any) {
        if (!this.checkSelectedItem(this.droppedItems, event.dragData)) {
            this.store.dispatch(new assignmentActions.SelectAssignmentAction(event.dragData));
            this.handleSubscription(
                this.store.pipe(select(assignmentSelector.getSelectAssignment), takeWhile(() => this.componentActive)).subscribe(
                    (result) => {
                        if (result != null) {
                            this.droppedItems = result;
                        }
                    }
                ));
        }
    }

    cancelSelect(event: any) {
        this.store.dispatch(new assignmentActions.RemoveAssignmentAction(event));
    }

    deleteObject(items, item) {
        const index = items.indexOf(item, 0);
        if (index > -1) {
            items.splice(index, 1);
        }
    }

    checkSelectedItem(items: Array<AssignmentModel>, item: AssignmentModel): boolean {
        for (let index = 0; index < items.length; index++) {
            if (items[index].id === item.id) {
                return true;
            }
        }
        return false;
    }

    outputData() {
        this.searchName.emit(this.text);
    }

    onSave() {
        this.selectItems = [];
        this.droppedItems.forEach(item => {
            const data = new AddAssignmentModel(item);
            this.selectItems.push(data);
        });
        this.seletectAssignments.emit(this.selectItems);
    }

    onCancel() {
        this.closeModal.emit('close');
        this.modalService.dismissAll();
    }
}
