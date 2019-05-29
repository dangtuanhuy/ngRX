import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import * as transferInActions from '../../transfer-in/state/transfer-in.action';
import * as transferInSelector from '../../transfer-in/state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import {
         InventoryTransactionTransferInViewModel,
         InventoryTransactionTransferInProductModel,
         InventoryTransactionTransferInProductItem
       } from '../transfer-in.model';
import * as moment from 'moment';
import { VariantModel, ProductListModel } from '../../products/product';
import { StockTypeModel } from '../../allocation-transaction/allocation-transaction.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ReportService } from 'src/app/shared/services/report.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-transfer-in',
  templateUrl: './detail-transfer-in.component.html',
  styleUrls: ['./detail-transfer-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailTransferInComponent extends ComponentBase {
  detailValueForm: FormGroup = new FormGroup({});
  constructor(
    private store: Store<any>,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private stockTypeService: StockTypeService,
    private reportService: ReportService,
    public injector: Injector
  ) {
    super(injector);
  }
  public componentActive = true;
  public isProductsLoading = true;
  public isStockTypesLoading = true;
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public inventoryTransactionTransferIn: InventoryTransactionTransferInViewModel;
  public inventoryTransactionTransferIns: Array<InventoryTransactionTransferInViewModel> = [];
  public inventoryTransactionTransferInProducts: Array<InventoryTransactionTransferInProductModel> = [];

  onInit() {
    this.detailValueForm = this.formBuilder.group({
      fromWareHouse: [''],
      toOutlet: [''],
      transferNumber: [''],
      createdDate: [''],
    });

    this.handleSubscription(this.store.pipe(
      select(transferInSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.getInventoryTransaction(id);
        }
      ));
  }

  getInventoryTransaction (id: string) {
    this.store.dispatch(new transferInActions.GetTransferIn(id));
    this.store.pipe(select(transferInSelector.getInventoryTransactionTransferIn), takeWhile(() => this.componentActive))
    .subscribe((inventoryTransactionTransferIn: InventoryTransactionTransferInViewModel) => {
      if (inventoryTransactionTransferIn == null) {
        return;
      }
      if (inventoryTransactionTransferIn != null) {
        this.detailValueForm.patchValue({
          fromWareHouse: inventoryTransactionTransferIn.fromLocation,
          toOutlet: inventoryTransactionTransferIn.toLocation,
          transferNumber: inventoryTransactionTransferIn.transferNumber,
          createdDate: inventoryTransactionTransferIn.createdDate,
        });
        this.inventoryTransactionTransferIn = inventoryTransactionTransferIn;
        this.getInventoryTransactionTransferInProducts(inventoryTransactionTransferIn.inventoryTransactionTransferProducts);
      }
    });
  }

  private getInventoryTransactionTransferInProducts(inventoryTransactionTransferInItems:
                                                     Array<InventoryTransactionTransferInProductModel>) {
    this.inventoryTransactionTransferInProducts = [];
    inventoryTransactionTransferInItems.forEach(inventoryTransactionTransferInItem => {
        const inventoryTransactionTransferInProduct: InventoryTransactionTransferInProductModel = {
            id: inventoryTransactionTransferInItem.id,
            productId: inventoryTransactionTransferInItem.productId !== Guid.empty()
                                              ? inventoryTransactionTransferInItem.productId
                                              : null,
            productName: inventoryTransactionTransferInItem.productName !== null
                                              ? inventoryTransactionTransferInItem.productName
                                              : null,
            variantId: inventoryTransactionTransferInItem.variantId !== Guid.empty()
                                              ? inventoryTransactionTransferInItem.variantId
                                              : null,
            stockTypeId: Guid.empty(),
            quantity: inventoryTransactionTransferInItem.quantity,
            stockTransactionRefId: inventoryTransactionTransferInItem.stockTransactionRefId,
            transactionRefId: inventoryTransactionTransferInItem.transactionRefId,
            variants: null,
            isVariantsLoading: true
        };
        if (inventoryTransactionTransferInItem.productId && inventoryTransactionTransferInItem.productId !== Guid.empty()) {
          inventoryTransactionTransferInProduct.variants = inventoryTransactionTransferInItem.variants;
          const productModel: ProductListModel = {
            id: inventoryTransactionTransferInProduct.productId,
            name: inventoryTransactionTransferInProduct.productName,
            variant: null
          };
          this.products = [...this.products, productModel];
          inventoryTransactionTransferInProduct.isVariantsLoading = false;
        } else {
          inventoryTransactionTransferInProduct.isVariantsLoading = false;
        }
        this.inventoryTransactionTransferInProducts.push(inventoryTransactionTransferInProduct);
    });
  }
  onDestroy() {
  }

  onPrintTransfer() {
    const transferStatementRequest: InventoryTransactionTransferInViewModel = {
      id: this.inventoryTransactionTransferIn.id,
      inventoryTransactionRefId: this.inventoryTransactionTransferIn.inventoryTransactionRefId,
      fromLocationId: this.inventoryTransactionTransferIn.fromLocationId,
      toLocationId: this.inventoryTransactionTransferIn.toLocationId,
      transferNumber: this.inventoryTransactionTransferIn.transferNumber,
      createdDate: this.inventoryTransactionTransferIn.createdDate,
      fromLocation: this.inventoryTransactionTransferIn.fromLocation,
      toLocation: this.inventoryTransactionTransferIn.toLocation,
      inventoryTransactionTransferProducts: this.inventoryTransactionTransferInProducts
    };

    const redirectWindow = window.open(environment.app.ims.url + '/report-loading', '_blank');
    this.reportService.printTransferInReport(transferStatementRequest).subscribe(
      data => {
        if (data.status === 1) {
         const reportRedirect: any = ((environment.app.report.apiUrl + '/reports?' + data.endPoint).replace(/["]/g, ''));
         redirectWindow.location = reportRedirect;
       } else {
         const reportErrorRedirect: any = ((environment.app.ims.url + '/report-error').replace(/["]/g, ''));
         redirectWindow.location = reportErrorRedirect;
       }
      }
    );
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

}
