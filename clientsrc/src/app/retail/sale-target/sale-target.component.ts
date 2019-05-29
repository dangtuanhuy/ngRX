import { ComponentBase } from 'src/app/shared/components/component-base';
import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SaleTargetService } from 'src/app/shared/services/sale-target.service';
import { Store, select } from '@ngrx/store';
import * as fromSaleTarget from './state/sale-target.reducer';
import * as saleTargetActions from './state/sale-target.action';
import * as saleTargetSelector from './state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { StoreSaleTargetModel, StoreSaleTargetViewModel, SaleTargetViewModel } from './sale-target.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSaleTargetComponent } from './add-sale-target/add-sale-target.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-sale-target',
    templateUrl: './sale-target.component.html',
    styleUrls: ['./sale-target.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SaleTargetComponent extends ComponentBase {

    @ViewChild('stocksTable') stockTable: any;
    public title;
    public componentActive = true;
    public userDefinedColumnSetting: UserDefinedColumnSetting;
    public pageSize = 10;
    public datasource: Array<StoreSaleTargetViewModel> = [];
    public isLoading = true;
    public currentPage = 0;
    public totalItems = 0;

    constructor(public injector: Injector,
        public storeService: SaleTargetService,
        private modalService: NgbModal,
        private store: Store<fromSaleTarget.SaleTargetState>) {
        super(injector);
    }

    onInit() {
        this.title = 'Store Management';
        this.handleSubscription(this.store.pipe(
            select(fromAuths.getUserId), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.userDefinedColumnSetting = new UserDefinedColumnSetting(
                        `${id}_UserDefinedColumnsLocation`,
                        'id,name,address',
                        environment.app.ims.apiUrl
                    );
                    this.getSaleTarget();
                }
            ));
        this.store.pipe(select(saleTargetSelector.getCurrentPage),
            takeWhile(() => this.componentActive))
            .subscribe(
                (data: number) => {
                    this.currentPage = data - 1;
                }
            );
        this.store.pipe(select(saleTargetSelector.getTotalItem),
            takeWhile(() => this.componentActive))
            .subscribe(
                (data: number) => {
                    this.totalItems = data;
                }
            );
        this.store.pipe(select(saleTargetSelector.getState),
            takeWhile(() => this.componentActive))
            .subscribe(
                (data: boolean) => {
                    if (data) {
                        this.datasource = this.setViewData(this.datasource);
                        this.store.dispatch(new saleTargetActions.ChangeState(false));
                    }
                }
            );
    }
    onDestroy() {
    }

    public getSaleTarget() {
        this.store.dispatch(new saleTargetActions.GetStores(new PagingFilterCriteria(1, this.pageSize)));
        this.store.pipe(select(saleTargetSelector.getStores),
            takeWhile(() => this.componentActive))
            .subscribe(
                (data: Array<StoreSaleTargetViewModel>) => {
                    this.isLoading = false;
                    this.datasource = this.setViewData(data);
                }
            );
    }

    onClickEdit(saleTarget: SaleTargetViewModel) {
        saleTarget.currentTarget = saleTarget.target;
        saleTarget.isEdit = true;
    }

    onClickCancel(saleTarget: SaleTargetViewModel) {
        saleTarget.target = saleTarget.currentTarget;
        saleTarget.isEdit = false;
    }

    onSave(saleTarget: SaleTargetViewModel) {
        this.store.dispatch(new saleTargetActions.UpdateSaleTarget(saleTarget));
        saleTarget.isEdit = false;
    }

    onDelete(saleTarget: SaleTargetViewModel) {
        this.store.dispatch(new saleTargetActions.DeleteSaleTarget(saleTarget.id));
    }

    public getCurrentTarget(saleTargets: Array<SaleTargetViewModel>): any {
        const today = new Date();
        let currentTarget = null;
        for (let index = saleTargets.length - 1; index >= 0; index--) {
            const toDate = new Date(saleTargets[index].toDate);
            if (new Date(today.getFullYear(), today.getMonth(), today.getDate()) <=
                new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())) {
                saleTargets[index].isCurrent = true;
                saleTargets[index].canEdit = true;
                currentTarget = (+saleTargets[index].target).toFixed(2);
                if (index - 1 >= 0) {
                    for (let y = index - 1; y >= 0; y--) {
                        saleTargets[y].isCurrent = false;
                        saleTargets[y].canEdit = true;
                    }
                }
                break;
            }
        }
        return currentTarget;
    }

    public setViewData(data: any): Array<StoreSaleTargetViewModel> {
        data.forEach(item => {
            item.saleTargets = _.orderBy(item.saleTargets, e => new Date(e.toDate), 'desc');
            item.currentTarget = this.getCurrentTarget(item.saleTargets);
            item.saleTargets.forEach(saleTarget => {
                saleTarget.fromDate = new Date(saleTarget.fromDate).toDateString();
                saleTarget.toDate = new Date(saleTarget.toDate).toDateString();
                saleTarget.currentTarget = (+saleTarget.target).toFixed(2);
                saleTarget.target = (+saleTarget.target).toFixed(2);
            });
        });
        return data;
    }
    public toggleExpandStocksRow(row: any) {
        this.stockTable.rowDetail.toggleExpandRow(row);
    }

    public onAddSaleTarget() {
        this.modalService.open(AddSaleTargetComponent, { size: 'lg', centered: true, backdrop: 'static' });
    }

    public setPage(event: any) {
        this.store.dispatch(new saleTargetActions.GetStores(new PagingFilterCriteria(event.offset + 1, this.pageSize)));
    }
}
