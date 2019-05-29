import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { StoreService } from 'src/app/shared/services/stores.service';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../state/store.reducer';
import * as storeSelector from '../state/index';
import { StoreModel, SaleTransactionModel } from '../stores.component';
import { takeWhile } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.scss']
})
export class ExportCsvComponent extends ComponentBase {
  public selectedStore: StoreModel;
  public componentActive = true;
  chooseDateForm: FormGroup = new FormGroup({});
  public chooseDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  public toDay = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  constructor(
    public injector: Injector,
    public storeService: StoreService,
    private store: Store<fromStore.StoreState>,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal) {
    super(injector);
  }

  onInit() {
    this.chooseDateForm = this.formBuilder.group({
      chooseDate: [this.chooseDate]
    });

    this.handleSubscription(this.store.pipe(
      select(storeSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (!id) {
            return;
          }
          this.getSelectedStore(id);
        }
      ));
  }
  onDestroy() {
  }

  getSelectedStore(id: string) {
    this.storeService.getById(id).subscribe(res => {
      this.selectedStore = res;
    });
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    if (this.selectedStore) {
      const date = this.chooseDateForm.get('chooseDate').value;
      const dateRequest = date !== null && date !== undefined ? date.year + '-' + date.month + '-' + date.day : Date.now();
      const saleTransactionModel: SaleTransactionModel = {
        LocationId: this.selectedStore.id,
        MachineId: this.selectedStore.machineId,
        ReportType: 'D',
        ToDate: moment.utc(dateRequest).format('YYYY-MM-DD')
      };
      const devideCode = this.selectedStore.devideCode;
      this.storeService.exportSaleTransactions(devideCode, saleTransactionModel).subscribe((data) => {
        const res = data.split('|');
        const blob = new Blob([res[1]], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, res[0]);
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = res[0];
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
      });
    }
  }
}
