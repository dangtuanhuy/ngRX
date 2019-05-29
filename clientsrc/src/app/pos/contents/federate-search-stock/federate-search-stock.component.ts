import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { VariantPagingModel } from '../../shared/view-models/variant-paging.model';
import { StockVariantPagingModel, ProductPagingModel } from '../../shared/view-models/product-paging.model';
import { VariantService } from '../../shared/services/variant.service';
import { CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { Product } from '../../shared/models/product';
import { Subject } from 'rxjs';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ProductService } from '../../shared/services/product.service';
import { Variant, VariantModel } from '../../shared/models/variant';
import { PosProductServerService } from '../../shared/services/server/pos-product-server.service';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { AppSetting } from '../../shared/models/appSetting';

@Component({
  selector: 'app-federate-search-stock',
  templateUrl: './federate-search-stock.component.html',
  styleUrls: ['./federate-search-stock.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FederateSearchStockComponent extends ComponentBase {
  @ViewChild('productTable') productTable: any;
  @ViewChild('variantTable') variantTable: any;
  public title = 'Other Stock Price';

  public userSetDefaultColumns = ['Name'];
  public userSetDefaultDetailColumns = ['Description', 'ListPrice', 'MemberPrice', 'StaffPrice', 'Quantity'];
  public searchProductInputId = '';
  public defaultPage = '';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public products: Product[] = [];
  public productPageIndex = 0;
  public productPageSize = 10;
  public productTotalItem = 0;

  public selectedProductId = '';

  private correspondingVariantPageIndex = 0;
  private correspondingVariantPageSize = 10;
  private correspondingVariantTotalItem = 0;

  public stockVariants: StockVariantPagingModel[] = [];

  private searchProductSubject = new Subject<any>();
  private searchProductText = '';

  expanded: any = {};

  constructor(
    private productService: ProductService,
    private variantService: VariantService,
    private posProductServerService: PosProductServerService,
    private appSettingService: AppSettingService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchProductInputId = PageInputId.federateStockPrice.inputIds.searchProductInput;

    this.productService.searchProductsPagingDelay(this.searchProductSubject)
      .subscribe((response: ProductPagingModel) => {
        this.products = response.products;
        this.productTotalItem = response.totalItem;
      });

    this.loadProducts();
  }
  onDestroy() {
    this.searchProductSubject.unsubscribe();
  }

  searchProduct(event) {
    if (this.searchProductText !== event) {
      this.productPageIndex = 0;
    }
    this.searchProductText = event;
    this.loadProducts();
  }

  setProductPage(pageInfo: { offset: number; }) {
    this.productPageIndex = pageInfo.offset;
    this.loadProducts();
  }

  public setVariantPage(pageInfo: { offset: number; }) {
    this.correspondingVariantPageIndex = pageInfo.offset;
    this.loadVariants();
  }

  loadProducts() {
    const searchTerm = {
      pageIndex: this.productPageIndex,
      pageSize: this.productPageSize,
      textSearch: this.searchProductText
    };

    this.searchProductSubject.next(searchTerm);
  }

  loadVariants() {
    this.variantService.getVariantsByProductId(this.selectedProductId).subscribe((variants: Variant[]) => {
      const variantIds = variants.map(x => x.variantId);
      this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode)
        .subscribe((deviceCodeAppsetting: AppSetting) => {
          if (deviceCodeAppsetting) {
            this.posProductServerService.getStockByVariants(deviceCodeAppsetting.value, variantIds)
              .subscribe((stocks: any[]) => {

                const variantModels: VariantModel[] = [];
                variants.forEach(variant => {
                  const currentStocks = stocks.filter(x => x.variantId === variant.variantId);
                  currentStocks.forEach(stock => {
                    const variantModel = new VariantModel();
                    variantModel.description = variant.description;
                    variantModel.listPrice = stock.listPrice;
                    variantModel.memberPrice = stock.memberPrice;
                    variantModel.staffPrice = stock.staffPrice;
                    variantModel.quantity = stock.variantQuantity;
                    variantModel.locationId = stock.locationId;
                    variantModel.locationName = stock.locationName;

                    variantModels.push(variantModel);
                  });
                });

                const correspondingStockVariant = this.stockVariants.find(x => x.productId === this.selectedProductId);
                if (correspondingStockVariant) {
                  correspondingStockVariant.variants = variantModels;
                } else {
                  const newStockVariant = new StockVariantPagingModel();
                  newStockVariant.productId = this.selectedProductId;
                  newStockVariant.variants = variantModels;

                  this.stockVariants.push(newStockVariant);
                }
              });
          }
        });
    });
    this.variantService.getByProductPaging([this.selectedProductId],
      this.correspondingVariantPageIndex, this.correspondingVariantPageSize)
      .subscribe((response: VariantPagingModel) => {
        const correspondingStockVariant = this.stockVariants.find(x => x.productId === this.selectedProductId);
        if (correspondingStockVariant) {
          correspondingStockVariant.variants = response.variants;
          correspondingStockVariant.pageNumber = response.pageNumber;
          correspondingStockVariant.pageSize = response.pageSize;
          correspondingStockVariant.totalItem = response.totalItem;
        } else {
          const newStockVariant = new StockVariantPagingModel();
          newStockVariant.productId = this.selectedProductId;
          newStockVariant.variants = response.variants;
          newStockVariant.pageNumber = response.pageNumber;
          newStockVariant.pageSize = response.pageSize;
          newStockVariant.totalItem = response.totalItem;

          this.stockVariants.push(newStockVariant);
        }
      });
  }

  toggleExpandRow(row) {
    this.productTable.rowDetail.toggleExpandRow(row);
    this.correspondingVariantPageIndex = 0;
    this.selectedProductId = row.id;
    this.loadVariants();
  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  getDetailVariants(productId: string) {
    const correspondingStockVariant = this.stockVariants.find(x => x.productId === productId);
    if (correspondingStockVariant) {
      return correspondingStockVariant.variants;
    }

    return [];
  }

  getDetailVariantPageIndex(productId: string) {
    const correspondingStockVariant = this.stockVariants.find(x => x.productId === productId);
    if (correspondingStockVariant) {
      return correspondingStockVariant.pageNumber;
    }

    return 0;
  }

  getDetailVariantPageSize(productId: string) {
    const correspondingStockVariant = this.stockVariants.find(x => x.productId === productId);
    if (correspondingStockVariant) {
      return correspondingStockVariant.pageSize;
    }

    return 0;
  }

  getDetailVariantPageTotalItem(productId: string) {
    const correspondingStockVariant = this.stockVariants.find(x => x.productId === productId);
    if (correspondingStockVariant) {
      return correspondingStockVariant.totalItem;
    }

    return 0;
  }

}
