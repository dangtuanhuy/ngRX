import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as storeActions from '../state/store.action';
import * as storeSelector from '../state/index';
import * as fromStore from '../state/store.reducer';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { StoreModel } from '../stores.component';

@Component({
    selector: 'app-update-store',
    templateUrl: './update-store.component.html',
    styleUrls: ['./update-store.component.scss']
})
export class UpdateStoreComponent extends ComponentBase {
    updateValueForm: FormGroup = new FormGroup({});
    constructor(private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private store: Store<fromStore.StoreState>,
        public injector: Injector
    ) {
        super(injector);
    }
    public componentActive = true;
    isDeactive: boolean;
    public storeModel: StoreModel;

    onInit() {
        this.updateValueForm = this.formBuilder.group({
            mall: ['', Validators.required],
            machineId: ['', Validators.required],
            accountId: ['', Validators.required],
            password: ['', Validators.required],
            serverIP: ['', Validators.required],
            port: ['', Validators.required],
            folderPath: ['', Validators.required]
        });

        this.handleSubscription(this.store.pipe(
            select(storeSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.store.dispatch(new storeActions.GetStore(id));
                }
            ));

        this.handleSubscription(this.store.pipe(
            select(storeSelector.getStore), takeWhile(() => this.componentActive))
            .subscribe(
                (store: StoreModel) => {
                    if (store == null) {
                        return;
                    }
                    this.storeModel = store;
                    this.updateValueForm.patchValue({
                        mall: this.storeModel.mall,
                        machineId: this.storeModel.machineId,
                        serverIP: this.storeModel.serverIP,
                        accountId: this.storeModel.accountId,
                        port: this.storeModel.port,
                        folderPath: this.storeModel.folderPath,
                        password: ''
                    });
                }));
    }

    onDestroy() { }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    onSave() {
        const mall = this.updateValueForm.get('mall').value;
        const machineId = this.updateValueForm.get('machineId').value;
        const serverIP = this.updateValueForm.get('serverIP').value;
        const accountId = this.updateValueForm.get('accountId').value;
        const password = this.updateValueForm.get('password').value;
        const port = this.updateValueForm.get('port').value;
        const folderPath = this.updateValueForm.get('folderPath').value;

        const storeSetting: any = {
            id: this.storeModel.id,
            mall: mall,
            machineId: machineId,
            serverIP: serverIP,
            accountId: accountId,
            password: password,
            port: Number(port),
            folderPath: folderPath
        };
        this.store.dispatch(new storeActions.UpdateStore(storeSetting));
    }
}

