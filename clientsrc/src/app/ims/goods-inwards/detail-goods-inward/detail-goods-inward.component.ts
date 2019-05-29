import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as goodsInwardSelector from '../../goods-inwards/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { ProductListModel } from '../../products/product';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ReportService } from 'src/app/shared/services/report.service';
import { environment } from 'src/environments/environment';
import {
  InventoryTransactionGoodsInwardViewModel,
  InventoryTransactionGoodsInwardProductModel,
  TransferProductModel
} from '../goods-inward.model';
import * as goodsInwardActions from '../state/goods-inward.action';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-goods-inward',
  templateUrl: './detail-goods-inward.component.html',
  styleUrls: ['./detail-goods-inward.component.scss']
})
export class DetailGoodsInwardComponent extends ComponentBase {
  detailValueForm: FormGroup = new FormGroup({});
  constructor(
    private store: Store<any>,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    public injector: Injector
  ) {
    super(injector);
  }
  public componentActive = true;
  public isProductsLoading = true;
  public products: Array<ProductListModel> = [];
  public inventoryTransactionGoodsInward: InventoryTransactionGoodsInwardViewModel;
  public inventoryTransactionGoodsInwards: Array<InventoryTransactionGoodsInwardViewModel> = [];
  public inventoryTransactionGoodsInwardProducts: Array<InventoryTransactionGoodsInwardProductModel> = [];

  onInit() {
    this.detailValueForm = this.formBuilder.group({
      fromVendor: [''],
      toWareHouse: [''],
      goodsInwardNumber: [''],
      createdDate: [''],
    });

    this.handleSubscription(this.store.pipe(
      select(goodsInwardSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new goodsInwardActions.GetGIWByInventoryTransactionId(id));
    this.store.pipe(select(goodsInwardSelector.GetGoodsInward), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransaction: InventoryTransactionGoodsInwardViewModel) => {
        if (inventoryTransaction == null) {
          return;
        }
        const inventoryTransactionGoodsInward = inventoryTransaction;
        if (inventoryTransactionGoodsInward != null) {
          inventoryTransactionGoodsInward.createdDate =
            moment.utc(inventoryTransactionGoodsInward.createdDate).format('YYYY-MM-DD');
          this.detailValueForm.patchValue({
            fromVendor: inventoryTransactionGoodsInward.fromLocation,
            toWareHouse: inventoryTransactionGoodsInward.toLocation,
            goodsInwardNumber: inventoryTransactionGoodsInward.transferNumber,
            createdDate: inventoryTransactionGoodsInward.createdDate,
          });
          this.inventoryTransactionGoodsInward = inventoryTransactionGoodsInward;
          this.products = this.GetProductModels(this.inventoryTransactionGoodsInward.products);
          this.getInventoryTransactionTransferInProducts(inventoryTransactionGoodsInward.inventoryTransactionTransferProducts);
        }
      });
  }

  private GetProductModels(products: TransferProductModel[]) {
    if (products === undefined || products === null) {
      return [];
    }
    const productModels = [];
    products.forEach(x => {
      const product: ProductListModel = {
        id: x.id,
        name: x.name,
        variant: null
      };
      productModels.push(product);
    });
    return productModels;
  }

  private getInventoryTransactionTransferInProducts(inventoryTransactionGoodInwardItems:
    Array<InventoryTransactionGoodsInwardProductModel>) {
    this.inventoryTransactionGoodsInwardProducts = [];
    inventoryTransactionGoodInwardItems.forEach(inventoryTransactionGoodInwardItem => {
      const inventoryTransactionTransferInProduct: InventoryTransactionGoodsInwardProductModel = {
        id: inventoryTransactionGoodInwardItem.id,
        productId: inventoryTransactionGoodInwardItem.productId !== Guid.empty()
          ? inventoryTransactionGoodInwardItem.productId
          : null,
        variantId: inventoryTransactionGoodInwardItem.variantId !== Guid.empty()
          ? inventoryTransactionGoodInwardItem.variantId
          : null,
        stockTypeId: Guid.empty(),
        quantity: inventoryTransactionGoodInwardItem.quantity,
        stockTransactionRefId: inventoryTransactionGoodInwardItem.stockTransactionRefId,
        transactionRefId: inventoryTransactionGoodInwardItem.transactionRefId,
        variants: [],
        isVariantsLoading: false,
      };
      inventoryTransactionTransferInProduct.variants =
        this.inventoryTransactionGoodsInward.products
          .find(x => x.id === inventoryTransactionTransferInProduct.productId) ?
          this.inventoryTransactionGoodsInward.products
            .find(x => x.id === inventoryTransactionTransferInProduct.productId).variants : [];
      this.inventoryTransactionGoodsInwardProducts.push(inventoryTransactionTransferInProduct);
    });
  }

  onDestroy() {
  }

  onPrintTransfer() {
    const transferStatementRequest: InventoryTransactionGoodsInwardViewModel = {
      id: this.inventoryTransactionGoodsInward.id,
      inventoryTransactionRefId: this.inventoryTransactionGoodsInward.inventoryTransactionRefId,
      fromLocationId: this.inventoryTransactionGoodsInward.fromLocationId,
      toLocationId: this.inventoryTransactionGoodsInward.toLocationId,
      transferNumber: this.inventoryTransactionGoodsInward.transferNumber,
      goodsInwardNumber: this.inventoryTransactionGoodsInward.transferNumber,
      createdDate: this.inventoryTransactionGoodsInward.createdDate,
      fromLocation: this.inventoryTransactionGoodsInward.fromLocation,
      toLocation: this.inventoryTransactionGoodsInward.toLocation,
      inventoryTransactionTransferProducts: this.inventoryTransactionGoodsInwardProducts,
      status: this.inventoryTransactionGoodsInward.status
    };

    const redirectWindow = window.open(environment.app.ims.url + '/report-loading', '_blank');
    this.reportService.printGoodsInwardReport(transferStatementRequest).subscribe(
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
