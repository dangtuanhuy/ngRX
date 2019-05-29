import { Component, Input, EventEmitter, Output, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDefinedColumnSetting } from '../../base-model/user-defined-column-setting.model';
import { ComponentBase } from '../component-base';
import { NotificationService } from '../../services/notification.service';
import { Store, select } from '@ngrx/store';
import { FormState } from '../../base-model/form.state';
import { Action } from '../../constant/form-action.constant';
import * as listViewManagementSelector from './state/index';
import * as listViewManagementActions from './state/list-view-management.actions';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-view-management',
  templateUrl: './list-view-management.component.html',
  styleUrls: ['./list-view-management.component.css']
})
export class ListViewManagementComponent extends ComponentBase {
  constructor(
    private _store: Store<any>,
    private modalService: NgbModal,
    private _notificationService: NotificationService,
    public injector: Injector,
    private router: Router,
    private route: ActivatedRoute) {
    super(injector);
  }
  @Input() totalItems = 0;
  public pageNumber = 0;
  @Input() title;
  @Input() datasource;
  @Input() pageSize = 10;
  @Input() listButton;
  @Input() actionType;
  @Input() addSuccessMessage: string;
  @Input() updateSuccessMessage: string;
  @Input() deleteSuccessMessage: string;
  @Input() userDefinedColumnSetting: UserDefinedColumnSetting;
  @Input() isHiddenSearchBox;
  @Output() clickButton = new EventEmitter<any>();
  @Output() changeSelectedPage = new EventEmitter<any>();
  @Output() changeSelectedColumnEvent = new EventEmitter<any>();
  @Output() resultDialog = new EventEmitter<any>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() searchQuery = new EventEmitter<any>();  
  @Input() isMultiSelect;
  public selectedItems =  new Array;

  onInit() {
    this.handleSubscription(
      this._store
        .pipe(select(listViewManagementSelector.getFormState))
        .subscribe((formState: FormState) => {
          if (!formState) {
            return;
          }
          if (formState.action === Action.None) {
            return;
          }
          if (formState.error === null) {
            switch (formState.action) {
              case Action.Add:
                this._notificationService.success(this.addSuccessMessage);
                this.closeDialog();
                break;
              case Action.Update:
                this._notificationService.success(this.updateSuccessMessage);
                this.closeDialog();
                break;
              case Action.Delete:
                this._notificationService.success(this.deleteSuccessMessage);
                this.closeDialog();
                break;
            }
          }
        })      
    );

    this.handleSubscription(
      this._store.pipe(select(listViewManagementSelector.getTotalItems)).subscribe(
        totalItems => {
          this.totalItems = totalItems;
          if (this.totalItems === (this.pageNumber) * this.pageSize) {
            this.pageNumber = this.pageNumber - 1;
          }
        }
      ));

    this.handleSubscription(
      this._store.pipe(select(listViewManagementSelector.getSelectedPage)).subscribe(
        selectedPage => {
          this.pageNumber = selectedPage;
        }
      ));    
  }

  private closeDialog() {
    this.modalService.dismissAll();
    this._store.dispatch(new listViewManagementActions.ChangeSelectedItemAction(null));
  }

  onDestroy() {
    this._store.dispatch(new listViewManagementActions.UpdateFormStateAction({
      action: Action.None,
      error: null
    }));
    this._store.dispatch(new listViewManagementActions.ResetState());
  }
  eventSelectedPage(page: any) {
    if (page !== undefined && page != null) {
      this.changeSelectedPage.emit(page);
      this._store.dispatch(new listViewManagementActions.ChangeSelectedPageAction(page));
    }
    this._store.dispatch(new listViewManagementActions.ResetState());
  }

  eventSelectedRow(selectedRow: any) {
    if (selectedRow !== undefined && selectedRow != null && this.isMultiSelect === undefined) {
      const itemId = selectedRow ? selectedRow[0].id : null;
      this._store.dispatch(new listViewManagementActions.ChangeSelectedItemAction(itemId));
      this.selectedRow.emit(selectedRow);
    }
    if (selectedRow !== undefined && selectedRow != null && this.isMultiSelect === true) {
      this.selectedItems = [];
      selectedRow.forEach(item => {
        this.selectedItems.push(item.id);
      });
      this._store.dispatch(new listViewManagementActions.ChangeSelectedItemsAction(this.selectedItems));
      this.selectedRow.emit(selectedRow);
    }
  }

  eventSearchQuery(event: any) {
    this.searchQuery.emit(event);
    this._store.dispatch(new listViewManagementActions.ChangeFilter(this.selectedItems));
  }

  eventClickButton(event: any) {
    this.clickButton.emit(event);
  }
}
