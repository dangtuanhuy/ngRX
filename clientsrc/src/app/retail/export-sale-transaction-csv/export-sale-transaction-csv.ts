import { ComponentBase } from 'src/app/shared/components/component-base';
import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/shared/services/stores.service';
import { SaleTransactionService } from 'src/app/shared/services/sale-transaction.service';
import * as moment from 'moment';

@Component({
    selector: 'app-export-sale-transaction-csv',
    templateUrl: './export-sale-transaction-csv.html',
    styleUrls: ['./export-sale-transaction-csv.scss']
})
export class ExportSaleTransactionCSVComponent extends ComponentBase {
    public selectLocation: any;
    public locations: any;
    public fromDateFillter = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
    public toDateFillter = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };

    constructor(private storeService: StoreService,
        private saleTransactionService: SaleTransactionService,
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
        this.saleTransactionService.exportSaleTransactionCSV(fromDate, toDate, this.selectLocation).subscribe((data) => {
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, 'SaleTransaction.csv');
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'SaleTransaction.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            window.URL.revokeObjectURL(url);
        });
    }
}
