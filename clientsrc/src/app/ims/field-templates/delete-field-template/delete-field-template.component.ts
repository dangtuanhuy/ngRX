import { Component, OnInit, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select, Action } from '@ngrx/store';
import * as fromFieldTemplate from '../state/field-template.reducer';
import * as fieldTemplateActions from '../state/field-template.action';
import * as fieldTemplateSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { FieldTemplateModel } from '../field-template.model';
import { FieldTemplateService } from 'src/app/shared/services/field-template.service';

@Component({
  selector: 'app-delete-field-template',
  templateUrl: './delete-field-template.component.html',
  styleUrls: ['./delete-field-template.component.css']
})
export class DeleteFieldTemplateComponent extends ComponentBase {

  public itemId: string;
  public componentActive = true;

  constructor(private activeModal: NgbActiveModal,
    private store: Store<fromFieldTemplate.FieldTemplateState>,
    private fieldTemplateService: FieldTemplateService,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.getSelectedItem();
  }

  onDestroy() {
  }

  getSelectedItem() {
    this.handleSubscription(this.store.pipe(select(fieldTemplateSelector.getSelectedItem),
      takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          this.itemId = id;
        }
      ));
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    this.store.dispatch(new fieldTemplateActions.DeleteFieldTemplate(this.itemId));
    this.activeModal.close('closed');
    this.store.dispatch(new fieldTemplateActions.ChangeSelectedItem(null));
  }

}
