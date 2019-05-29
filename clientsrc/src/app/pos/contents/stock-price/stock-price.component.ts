import {
  Component,
  ViewEncapsulation,
  Injector,
  ViewChild
} from '@angular/core';
import { CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product';
import { ProductPagingModel, StockVariantPagingModel } from '../../shared/view-models/product-paging.model';
import { Variant } from '../../shared/models/variant';
import { VariantService } from '../../shared/services/variant.service';
import { VariantPagingModel } from '../../shared/view-models/variant-paging.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stock-price',
  templateUrl: './stock-price.component.html',
  styleUrls: ['./stock-price.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockPriceComponent extends ComponentBase {
  @ViewChild('productTable') productTable: any;
  @ViewChild('variantTable') variantTable: any;
  public title = 'Stock Price';

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
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchProductInputId = PageInputId.stockPrice.inputIds.searchProductInput;

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
    this.variantService.getByProductPaging([this.selectedProductId], this.correspondingVariantPageIndex, this.correspondingVariantPageSize)
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

  public onDetailToggle(event) {

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
