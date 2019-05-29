import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { InventoryTransactionTransferInViewModel } from 'src/app/ims/transfer-in/transfer-in.model';
import { InventoryTransactionTransferOutViewModel } from 'src/app/ims/transfer-out/transfer-out.model';
import { InventoryTransactionGoodsInwardViewModel } from 'src/app/ims/goods-inwards/goods-inward.model';
import { SalesInvoiceViewModel, UpdatePurchaseOrderModel } from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { Observable } from 'rxjs';
import { SalePerformanceRequest } from 'src/app/retail/sale-performance/sale-performance.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService extends ServiceBase {
    printTransferInReport(request: InventoryTransactionTransferInViewModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/reports/transfer-in`, request);
    }

    printTransferOutStatement(request: InventoryTransactionTransferOutViewModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/reports/transfer-out`, request);
    }

    printGoodsInwardReport (request: InventoryTransactionGoodsInwardViewModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/reports/goods-inward`, request);
    }

    printSalesInvoiceReport(request: SalesInvoiceViewModel) {
        return this.post<any>(`${environment.app.purchaseOrder.apiUrl}/api/reports/sales-invoice`, request);
    }

    printPurchaseOrderReport(request: UpdatePurchaseOrderModel) {
        return this.post<any>(`${environment.app.purchaseOrder.apiUrl}/api/reports/purchase-order`, request);
    }

    printPurchaseReturnReport(request: UpdatePurchaseOrderModel) {
        return this.post<any>(`${environment.app.purchaseOrder.apiUrl}/api/reports/purchase-return`, request);
    }

    reportSalePerformance(request: SalePerformanceRequest): any {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/reports/sale-performance`, request, { responseType: 'text/csv' });
    }
}
