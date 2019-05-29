import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import * as transferOutActions from '../../transfer-out/state/transfer-out.action';
import * as transferOutSelector from '../../transfer-out/state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { InventoryTransactionTransferOutViewModel, InventoryTransactionTransferOutProductModel } from '../transfer-out.model';
import * as moment from 'moment';
import { VariantModel, ProductListModel } from '../../products/product';
import { StockTypeModel } from '../../allocation-transaction/allocation-transaction.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ReportService } from 'src/app/shared/services/report.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-transfer-out',
  templateUrl: './detail-transfer-out.component.html',
  styleUrls: ['./detail-transfer-out.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailTransferOutComponent extends ComponentBase {
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
  public inventoryTransactionTransferOut: InventoryTransactionTransferOutViewModel;
  public inventoryTransactionTransferOuts: Array<InventoryTransactionTransferOutViewModel> = [];
  public inventoryTransactionTransferOutProducts: Array<InventoryTransactionTransferOutProductModel> = [];

  onInit() {
    this.getStockTypes();
    this.detailValueForm = this.formBuilder.group({
      fromWareHouse: [''],
      toOutlet: [''],
      transferNumber: [''],
      createdDate: [''],
    });

    this.handleSubscription(this.store.pipe(
      select(transferOutSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.getInventoryTransaction(id);
        }
      ));
  }

  getInventoryTransaction(id: string) {
    this.store.dispatch(new transferOutActions.GetTransferOut(id));
    this.store.pipe(select(transferOutSelector.GetTransferOut), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionTransferOut: InventoryTransactionTransferOutViewModel) => {
        if (inventoryTransactionTransferOut == null) {
          return;
        }
        if (inventoryTransactionTransferOut != null) {
          this.detailValueForm.patchValue({
            fromWareHouse: inventoryTransactionTransferOut.fromLocation,
            toOutlet: inventoryTransactionTransferOut.toLocation,
            transferNumber: inventoryTransactionTransferOut.transferNumber,
            createdDate: inventoryTransactionTransferOut.createdDate,
          });
          this.inventoryTransactionTransferOut = inventoryTransactionTransferOut;
          this.getInventoryTransactionTransferOutProducts(inventoryTransactionTransferOut.inventoryTransactionTransferProducts);
        }
      });
  }

  private getInventoryTransactionTransferOutProducts(inventoryTransactionTransferOutItems:
    Array<InventoryTransactionTransferOutProductModel>) {
    this.inventoryTransactionTransferOutProducts = [];
    inventoryTransactionTransferOutItems.forEach(inventoryTransactionTransferOutItem => {
      const inventoryTransactionTransferOutProduct: InventoryTransactionTransferOutProductModel = {
        id: inventoryTransactionTransferOutItem.id,
        productId: inventoryTransactionTransferOutItem.productId !== Guid.empty()
          ? inventoryTransactionTransferOutItem.productId
          : null,
        productName: inventoryTransactionTransferOutItem.productName !== null
          ? inventoryTransactionTransferOutItem.productName
          : null,
        variantId: inventoryTransactionTransferOutItem.variantId !== Guid.empty()
          ? inventoryTransactionTransferOutItem.variantId
          : null,
        stockTypeId: Guid.empty(),
        quantity: inventoryTransactionTransferOutItem.quantity,
        stockTransactionRefId: inventoryTransactionTransferOutItem.stockTransactionRefId,
        transactionRefId: inventoryTransactionTransferOutItem.transactionRefId,
        variants: null,
        isVariantsLoading: true
      };
      if (inventoryTransactionTransferOutItem.productId && inventoryTransactionTransferOutItem.productId !== Guid.empty()) {
        inventoryTransactionTransferOutProduct.variants = inventoryTransactionTransferOutItem.variants;
          const productModel: ProductListModel = {
            id: inventoryTransactionTransferOutItem.productId,
            name: inventoryTransactionTransferOutItem.productName,
            variant: null
          };
          this.products = [...this.products, productModel];
          inventoryTransactionTransferOutProduct.isVariantsLoading = false;
      } else {
        inventoryTransactionTransferOutProduct.isVariantsLoading = false;
      }
      this.inventoryTransactionTransferOutProducts.push(inventoryTransactionTransferOutProduct);
    });
  }
  onDestroy() {
  }

  onPrintTransfer() {
    const transferStatementRequest: InventoryTransactionTransferOutViewModel = {
      id: this.inventoryTransactionTransferOut.id,
      fromLocationId: this.inventoryTransactionTransferOut.fromLocationId,
      toLocationId: this.inventoryTransactionTransferOut.toLocationId,
      transferNumber: this.inventoryTransactionTransferOut.transferNumber,
      createdDate: this.inventoryTransactionTransferOut.createdDate,
      fromLocation: this.inventoryTransactionTransferOut.fromLocation,
      toLocation: this.inventoryTransactionTransferOut.toLocation,
      inventoryTransactionRefId: Guid.empty(),
      inventoryTransactionTransferProducts: this.inventoryTransactionTransferOutProducts
    };

    const redirectWindow = window.open(environment.app.ims.url + '/report-loading', '_blank');
    this.reportService.printTransferOutStatement(transferStatementRequest).subscribe(
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
  private getStockTypes() {
    this.isStockTypesLoading = true;
    this.stockTypeService.getAllWithoutPaging().subscribe(res => {
      this.stockTypes = res;
      this.isStockTypesLoading = false;
    });
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

}
