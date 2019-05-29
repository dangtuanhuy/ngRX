import {
    Component, Input, Injector, Output, EventEmitter,
    AfterViewChecked, ViewChild, ElementRef
} from '@angular/core';
import {
    AllocationTransactionModel,
    AllocationTransactionItem, MassAllocationInfoModel, OutletQuantityModel, OutletProduct, MassAllocationModel
} from '../allocation-transaction.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Guid } from 'src/app/shared/utils/guid.util';
import { AllocationTransactionStatusEnum } from 'src/app/shared/constant/allocation-transaction.constant';
import { AllocationTransactionService } from 'src/app/shared/services/allocation-transaction.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as moment from 'moment';
import { GoodsInwardService } from 'src/app/shared/services/goods-inward.service';
import { InventoryTransactionStatusEnum } from 'src/app/shared/constant/inventory-transaction.constant';
import { UpdateGIWStatusModel } from '../../goods-inwards/goods-inward.model';
import { Store } from '@ngrx/store';
import * as goodsInwardActions from '../../goods-inwards/state/goods-inward.action';

@Component({
    selector: 'app-mass-allocation-transaction',
    templateUrl: './mass-allocation-transaction.component.html',
    styleUrls: ['./mass-allocation-transaction.component.scss']
})

export class MassAllocationTransactionComponent extends ComponentBase implements AfterViewChecked {

    @Input() fromLocationId: string;
    @Input() inventoryTransactionId: string;
    @Output() isMassAllocation: EventEmitter<any> = new EventEmitter();
    @ViewChild('inputQty') inputfield: ElementRef<HTMLElement>;
    public massAllocationTransactions: MassAllocationInfoModel = { massAllocations: [], outletInfor: [] };
    public allocationTransactions: Array<AllocationTransactionModel> = [];
    public count = 0;

    public filteredFromDate;
    public filteredToDate;
    public current: any;
    public deliveryDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };

    constructor(private allocationTransactionService: AllocationTransactionService, private goodsInwardService: GoodsInwardService,
        private store: Store<any>,
        private notificationService: NotificationService,
        public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.getMassAllocation(this.inventoryTransactionId);
    }
    onDestroy() {

    }

    ngAfterViewChecked() {
        this.setWidthColumn();
    }

    onCancel() {
        this.isMassAllocation.emit(false);
    }

    onSave() {
        const filteredFromDate = this.filteredFromDate !== null && this.filteredFromDate !== undefined ?
            this.filteredFromDate.year + '-' + this.filteredFromDate.month + '-' + this.filteredFromDate.day
            : Date.now();
        const filteredToDate = this.filteredToDate !== null && this.filteredToDate !== undefined ?
            this.filteredToDate.year + '-' + this.filteredToDate.month + '-' + this.filteredToDate.day
            : Date.now();

        const fromDate = moment.utc(filteredFromDate).format('YYYY-MM-DD');
        const toDate = moment.utc(filteredToDate).format('YYYY-MM-DD');
        const deliveryDate = this.deliveryDate !== null && this.deliveryDate !== undefined ?
            this.deliveryDate.year + '-' + this.deliveryDate.month + '-' + this.deliveryDate.day
            : Date.now();
        this.massAllocationTransactions.outletInfor.forEach((outlet, index) => {
            const allocation: AllocationTransactionModel = {
                id: Guid.empty(),
                name: '',
                description: '',
                fromLocationId: this.fromLocationId,
                toLocationId: outlet.id,
                deliveryDate: moment.utc(deliveryDate).format('YYYY-MM-DD'),
                transactionRef: this.inventoryTransactionId,
                status: AllocationTransactionStatusEnum.Submitted,
                allocationTransactionDetails: [],
            };

            this.massAllocationTransactions.massAllocations.forEach(massAllocationTransaction => {
                if (massAllocationTransaction.outlets[index].quantity > 0) {
                    const allocationItem: AllocationTransactionItem = {
                        id: Guid.empty(),
                        productId: Guid.empty(),
                        productName: '',
                        variantId: massAllocationTransaction.variantId,
                        quantity: massAllocationTransaction.outlets[index].quantity,
                        stockOnHand: 0,
                        allocationTransactionId: Guid.empty(),
                    };
                    allocation.allocationTransactionDetails.push(allocationItem);
                }
            });
            if (allocation.allocationTransactionDetails.length > 0) {
                this.allocationTransactions.push(allocation);
            }
        });

        this.allocationTransactionService.addMulti(this.allocationTransactions, fromDate, toDate).subscribe(
            res => {
                this.updateGIWStatus();
                this.resetAllocationTransaction();
                this.getMassAllocation(this.inventoryTransactionId);
                this.notificationService.success('AllocationTransaction is added.');
            }
        );
    }

    updateGIWStatus() {
        const totalRemaining = this.massAllocationTransactions.massAllocations.reduce((runningValue: number, item: MassAllocationModel) =>
                    runningValue + item.remaining, 0);
        const totalQuantity = this.massAllocationTransactions.massAllocations.reduce((runningValue: number, item: MassAllocationModel) =>
                    runningValue + item.giwQuantity, 0);

        if (totalRemaining === 0) {
            this.goodsInwardService
            .updateStatus(new UpdateGIWStatusModel(this.inventoryTransactionId, InventoryTransactionStatusEnum.Allocated))
            .subscribe(result => {
                if (result) {
                    this.store.dispatch(new goodsInwardActions
                        .UpdateGoodsInwardSuccess(new UpdateGIWStatusModel(
                            this.inventoryTransactionId, InventoryTransactionStatusEnum.Allocated)));
                }
            });
        }
        if (totalRemaining < totalQuantity && totalRemaining !== 0) {
            this.goodsInwardService
            .updateStatus(new UpdateGIWStatusModel(this.inventoryTransactionId, InventoryTransactionStatusEnum.Partial))
            .subscribe(result => {
                if (result) {
                    this.store.dispatch(new goodsInwardActions
                        .UpdateGoodsInwardSuccess(new UpdateGIWStatusModel(
                            this.inventoryTransactionId, InventoryTransactionStatusEnum.Partial)));
                }
            });
        }
    }

    getMassAllocation(inventoryTransactionId: string) {
        this.allocationTransactionService.getMassAllocation(inventoryTransactionId).subscribe(
            (res: any) => {
                this.massAllocationTransactions = this.fillMaxValueForQuantity(res);
                this.count = this.massAllocationTransactions.outletInfor.length * 3;
            }
        );
    }

    refreshMaxValueQuantity(event: number, x: number, y: number) {
        this.massAllocationTransactions.massAllocations[x].outlets[y].quantity = event;
        const total = this.massAllocationTransactions.massAllocations[x].outlets.reduce((runningValue: number, item: OutletQuantityModel) =>
            runningValue + item.quantity, 0);

        this.massAllocationTransactions.massAllocations[x].remaining =
            this.massAllocationTransactions.massAllocations[x].remainingBalance - total;
        if (this.massAllocationTransactions.massAllocations[x].remaining < 0) {
            this.massAllocationTransactions.massAllocations[x].remaining = 0;
            this.massAllocationTransactions.massAllocations[x].outlets[y].quantity
                = this.massAllocationTransactions.massAllocations[x].outlets[y].maxQuantity;
            this.notificationService.error(`Exceed quantity`);
            // this.inputfield.nativeElement.blur();
        }
        this.massAllocationTransactions.massAllocations[x].outlets.forEach(item => {
            item.maxQuantity = item.quantity + this.massAllocationTransactions.massAllocations[x].remaining;
        });
    }

    private fillMaxValueForQuantity(massAllocationTransactions: MassAllocationInfoModel)
        : MassAllocationInfoModel {
        massAllocationTransactions.massAllocations.forEach(massAllocationTransaction => {
            massAllocationTransaction.remaining = massAllocationTransaction.remainingBalance;
            massAllocationTransaction.outlets.forEach(item => {
                item.maxQuantity = massAllocationTransaction.remainingBalance;
            });
        });
        return massAllocationTransactions;
    }

    onClickFilter() {
        const filteredFromDate = this.filteredFromDate !== null && this.filteredFromDate !== undefined ?
            this.filteredFromDate.year + '-' + this.filteredFromDate.month + '-' + this.filteredFromDate.day
            : Date.now();
        const filteredToDate = this.filteredToDate !== null && this.filteredToDate !== undefined ?
            this.filteredToDate.year + '-' + this.filteredToDate.month + '-' + this.filteredToDate.day
            : Date.now();

        const fromDate = moment.utc(filteredFromDate).format('YYYY-MM-DD');
        const toDate = moment.utc(filteredToDate).format('YYYY-MM-DD');
        this.allocationTransactionService.getMassAllocationByDate(fromDate, toDate, this.fromLocationId)
            .subscribe((result: Array<OutletProduct>) => {
                this.resetQuantity();
                if (result.length > 0) {
                    this.massAllocationTransactions.massAllocations.forEach(mass => {
                        mass.remaining = mass.remainingBalance;
                        for (const outlet of mass.outlets) {
                            const product = result.find(x => x.outletId === outlet.id && x.variantId === mass.variantId);
                            outlet.quantitySold = product != null ? product.quantitySold : 0;
                            if (mass.remainingBalance > 0) {
                                if (product) {
                                    outlet.quantity = (mass.remaining - product.quantity) >= 0 ? product.quantity : mass.remaining;
                                    mass.remaining = mass.remaining - outlet.quantity;
                                }
                            }
                        }
                    });
                }
            });
    }

    resetQuantity() {
        this.massAllocationTransactions.massAllocations.forEach(mass => {
            mass.remaining = mass.remainingBalance;
            mass.outlets.forEach(outlet =>
                outlet.quantity = 0);
        });
    }

    resetAllocationTransaction() {
        this.allocationTransactions = [];
    }

    setWidthColumn() {
        const thElements = document.getElementsByTagName('th');
        const tdElements = document.getElementsByTagName('td');
        const widthHeader = [];
        let tempResult = null;
        if (thElements.length !== 0 && tdElements.length !== 0) {
            for (let i = 0; i < 5; i++) {
                tempResult = window.getComputedStyle(tdElements[i], null).getPropertyValue('width');
                widthHeader.push(`${tempResult.toString()}`);
            }

            const valueInRow = 5 + this.count;
            for (let x = 0; x < (this.count / 3); x++) {
                const countStart = valueInRow - this.count + x * 3;
                tempResult = tdElements[countStart].offsetWidth
                    + tdElements[countStart + 1].offsetWidth
                    + tdElements[countStart + 2].offsetWidth;

                thElements[x + 6].style.width = `${tempResult}px`;
            }
            for (let i = 0; i < 5; i++) {
                thElements[i].style.width = widthHeader[i];
            }
        }
    }
}
