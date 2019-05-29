import { ComponentBase } from 'src/app/shared/components/component-base';
import { Component, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocationService } from 'src/app/shared/services/location.service';
import { map } from 'rxjs/operators';
import { AddSaleTargetModel, SaleTargetModel } from '../sale-target.model';
import { Store } from '@ngrx/store';
import * as fromSaleTarget from '../state';
import * as saleTargetActions from '../state/sale-target.action';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Guid } from 'src/app/shared/utils/guid.util';

@Component({
    selector: 'app-add-sale-target',
    templateUrl: './add-sale-target.component.html',
    styleUrls: ['./add-sale-target.component.scss']
})

export class AddSaleTargetComponent extends ComponentBase {

    addValueForm: FormGroup = new FormGroup({});
    public stores: any;
    selectedStore: any;
    constructor(public injector: Injector,
        private locationService: LocationService,
        private activeModal: NgbActiveModal,
        private store: Store<fromSaleTarget.State>,
        private formBuilder: FormBuilder) {
        super(injector);
    }
    onInit() {
        this.addValueForm = this.formBuilder.group({
            store: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            target: ['', Validators.required]
        });

        this.locationService.retailSearchStores('').subscribe(result => this.stores = result);
    }
    onDestroy() {

    }

    onSave() {
        const target = this.addValueForm.get('target').value;
        const fromDate = this.addValueForm.get('fromDate').value;
        const toDate = this.addValueForm.get('toDate').value;
        const newDevice: SaleTargetModel = {
            id: Guid.empty(),
            storeId: this.selectedStore,
            fromDate: new Date(fromDate.year, fromDate.month - 1, fromDate.day).toDateString(),
            toDate: new Date(toDate.year, toDate.month - 1, toDate.day).toDateString(),
            target: target
        };
        this.store.dispatch(new saleTargetActions.AddSaleTarget(newDevice));
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

}

