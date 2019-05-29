import { Component, Injector, Input } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogType, ConFirmDialogResult } from '../../shared/enums/dialog-type.enum';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent extends ComponentBase {

  @Input() title = '';
  @Input() message = '';
  @Input() dialogType = DialogType.YesNo;

  constructor(
    private activeModal: NgbActiveModal,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

  }
  onDestroy() {

  }

  onYes() {
    this.activeModal.close(ConFirmDialogResult.Yes);
  }

  onNo() {
    this.activeModal.close(ConFirmDialogResult.No);
  }

  onOk() {
    this.activeModal.close(ConFirmDialogResult.Ok);
  }
}
