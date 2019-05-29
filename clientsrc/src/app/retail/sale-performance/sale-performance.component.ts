import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { StoreService } from 'src/app/shared/services/stores.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { SaleTargetService } from 'src/app/shared/services/sale-target.service';
import * as moment from 'moment';
import { OrderModel, OrderItem, SalePerformanceRequest } from './sale-performance.model';
import { ReportService } from 'src/app/shared/services/report.service';

@Component({
    selector: 'app-report-sale-performance',
    templateUrl: './sale-performance.component.html',
    styleUrls: ['./sale-performance.component.scss'],
})

export class SalePerformanceComponent extends ComponentBase {

    public locations: any;
    public selectLocation: string;
    public fromDateFillter = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
    public toDateFillter = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };

    constructor(private storeService: StoreService,
        private saleTargetService: SaleTargetService,
        private reportService: ReportService,
        public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.storeService.getAll().subscribe(result => this.locations = result);
    }
    onDestroy() {

    }

    exportFile() {
        let date = this.fromDateFillter !== null && this.fromDateFillter !== undefined ?
            this.fromDateFillter.year + '-' + this.fromDateFillter.month + '-' + this.fromDateFillter.day
            : Date.now();
        const fromDate = moment.utc(date).format('YYYY-MM-DD');
        date = this.toDateFillter !== null && this.toDateFillter !== undefined ?
            this.toDateFillter.year + '-' + this.toDateFillter.month + '-' + this.toDateFillter.day
            : Date.now();
        const toDate = moment.utc(date).format('YYYY-MM-DD');
        this.saleTargetService.getOrderItems(this.selectLocation, fromDate, toDate).subscribe(
            (orderItems: Array<OrderItem>) => {
                if (orderItems) {
                    const salePerformanceModel: SalePerformanceRequest = {
                        locationId: this.selectLocation,
                        fromDate: new Date(fromDate),
                        toDate: new Date(toDate),
                        orderItems: orderItems,
                    };
                    this.reportService.reportSalePerformance(salePerformanceModel).subscribe(
                        (result) => {
                            const blob = new Blob([result], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);

                            if (navigator.msSaveOrOpenBlob) {
                                navigator.msSaveBlob(blob, 'SalePerformance.csv');
                            } else {
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'SalePerformance.csv';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }
                            window.URL.revokeObjectURL(url);
                        }
                    );
                }
            }
        );
    }
}
