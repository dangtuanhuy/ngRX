import { Component, ViewEncapsulation, HostListener, Injector } from '@angular/core';
import { BigButton } from 'src/app/shared/base-model/big-button.model';
import { Router } from '@angular/router';
import { FunctionConstants, ShortKeyConstants, FeatureConstants } from './quick-select.constants';
import { ShortcutService } from '../../shared/services/shortcut.service';
import { PageConstants } from '../../shared/constants/common.constant';
import { ShortcutModel } from '../../shared/models/shortcut.model';
import { Store, select } from '@ngrx/store';
import { ComponentBase } from 'src/app/shared/components/component-base';
import * as salesActions from '../../sales/state/sales.action';
import * as fromSaleSelector from '../../sales/state/index';
import * as fromSales from '../../sales/state/sales.reducer';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { ProductViewModel } from '../../shared/models/product-view.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as fromQuickSelects from './state/quick-select.reducer';
import * as quickSelectActions from './state/quick-select.action';
import * as quickSelectSelector from './state/index';
import { Variant } from '../../shared/models/variant';
import * as fromSale from '../../sales/state/sales.reducer';
import { AppContextManager } from '../../shared/app-context-manager';
import { ActivatedScreen } from '../../shared/enums/activated-screen.enum';
import { DeviceHubService } from '../../shared/services/device-hub.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConFirmDialogResult } from '../../shared/enums/dialog-type.enum';
import { PendingSale, PendingSaleModel } from '../../shared/models/pending-sale';
import { PendingSaleItem } from '../../shared/models/pending-sale-item';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';

@Component({
  selector: 'app-quick-select',
  templateUrl: './quick-select.component.html',
  styleUrls: ['./quick-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickSelectComponent extends ComponentBase {
  private categoryPageIndex = 0;
  private categoryPageSize = 7;
  private categoryTotalItems = 0;

  private variantPageIndex = 0;
  private variantPageSize = 14;
  private variantTotalItems = 0;

  private selectedCategoryId = '';

  public shortcuts: ShortcutModel[] = [];
  public pageActive = false;
  private variants: Variant[] = [];
  private isOpeningNewSalePopup = false;

  public categoriesBigButtons: BigButton[] = [];

  public productsBigButtons: BigButton[] = [];

  public featuresBigButtons: BigButton[] = [
    new BigButton({ id: FeatureConstants.RecentSales, width: 100, height: 100, colspan: 1, title: '<span> Recent sales </span>' }),
    new BigButton({ id: FeatureConstants.PendingSales, width: 100, height: 100, colspan: 1, title: '<span> Pending sales </span>' }),
    new BigButton({ id: FeatureConstants.PickupOrders, width: 100, height: 100, colspan: 1, title: '<span> Pickup orders </span>' }),
    new BigButton({ id: FeatureConstants.OpenDay, width: 100, height: 100, colspan: 1, title: '<span> Open </span>' }),
    new BigButton({ id: FeatureConstants.CloseDay, width: 100, height: 100, colspan: 1, title: '<span> Close </span>' }),
    new BigButton({
      id: FeatureConstants.StockAndPriceLookup, width: 100, height: 100, colspan: 1, title: '<span>Stock and price</span>'
    }),
    new BigButton({
      id: FeatureConstants.FederateSearchStock, width: 100, height: 100, colspan: 1, title: '<span>Other Stock and price</span>'
    }),
    new BigButton({
      id: FeatureConstants.ManageShortcut, width: 100, height: 100, colspan: 1, title: '<span>App Settings</span>'
    }),
    new BigButton({
      id: FeatureConstants.CustomerManagement, width: 100, height: 100, colspan: 1, title: '<span>Manage customer</span>'
    })
  ];

  public shortKeysBigButtons: BigButton[] = [
    new BigButton({ id: ShortKeyConstants.NewSale, width: 100, height: 100, colspan: 1, title: '<span> New sale </span>' }),
    new BigButton({ id: ShortKeyConstants.SaveSale, width: 100, height: 100, colspan: 1, title: '<span> Save sale </span>' }),
    new BigButton({ id: ShortKeyConstants.Promotion, width: 100, height: 100, colspan: 1, title: '<span>Promotions</span>' }),
    new BigButton({ id: ShortKeyConstants.OpenCashDrawer, width: 100, height: 100, colspan: 1, title: '<span> Open cash drawer' }),
    // new BigButton({ id: ShortKeyConstants.TaxExempt, width: 100, height: 100, colspan: 1, title: '<span> Tax exempt </span>' }),
    // new BigButton({ id: ShortKeyConstants.Notes, width: 100, height: 100, colspan: 1, title: '<span> Notes </span>' }),
    // new BigButton({
    //   id: ShortKeyConstants.PrintLastReceipt, width: 100, height: 100, colspan: 1, title: '<span> Print last receipt </span>'
    // }),
    // new BigButton({ id: ShortKeyConstants.Coupons, width: 100, height: 100, colspan: 1, title: '<span> Coupons </span>' }),
    // new BigButton({ id: ShortKeyConstants.GiftReceipt, width: 100, height: 100, colspan: 1, title: '<span> Gift receipt </span>' }),
    // new BigButton({ id: ShortKeyConstants.AddShipping, width: 100, height: 100, colspan: 1, title: '<span> Add shipping </span>' })
  ];

  public functionsBigButtons: BigButton[] = [
    new BigButton({
      id: FunctionConstants.Users,
      // title: '<i class="fas fa-users"></i>',
      title: '',
      fontSize: '30px', width: 200, height: 100,
      colspan: 2, backgroundColor: '#f4c245'
    }),
    new BigButton({
      id: FunctionConstants.Lock,
      // title: '<i class="fas fa-lock"></i>',
      title: '',
      fontSize: '30px', width: 200, height: 100, colspan: 2, backgroundColor: '#f4c245'
    }),
    new BigButton({
      id: FunctionConstants.Return,
      // title: `<span style="'font-weight': 'bold'">RETURN</span>`,
      title: `<span style="'font-weight': 'bold'"></span>`,
      width: 200, height: 100, colspan: 2, backgroundColor: '#eb5257'
    }),
    new BigButton({
      id: FunctionConstants.Payment, title: '<span style="font-weight: bold"> PAY </span>',
      width: 300, height: 100, colspan: 3, backgroundColor: '#a5c536'
    })
  ];

  private pageShortcutIds = {
    features: [
      FeatureConstants.RecentSales,
      FeatureConstants.PendingSales,
      FeatureConstants.PickupOrders,
      FeatureConstants.OpenDay,
      FeatureConstants.StockAndPriceLookup,
      FeatureConstants.ManageShortcut,
      FeatureConstants.CustomerManagement
    ],
    shortKeys: [
      ShortKeyConstants.NewSale,
      ShortKeyConstants.SaveSale,
      ShortKeyConstants.Promotion
    ],
    functions: [
      FunctionConstants.Payment
    ]
  };

  private mappingShortcuts: any[] = [];

  private gridNames = {
    feature: 'feature',
    shortKey: 'short-key',
    function: 'function'
  };

  private customer: CustomerModel = new CustomerModel();
  private products: ProductViewModel[] = [];

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const selectedShortcut = this.mappingShortcuts.find(x => x.shortcutKey === event.key.toLowerCase());
    if (!selectedShortcut) {
      return;
    }

    if (selectedShortcut.gridName === this.gridNames.feature) {
      this.onClickFeature(selectedShortcut.id);
    }

    if (this.pageActive) {
      if (selectedShortcut.gridName === this.gridNames.shortKey) {
        this.onClickShortKey(selectedShortcut.id);
      }

      if (selectedShortcut.gridName === this.gridNames.function) {
        this.onClickFunction(selectedShortcut.id);
      }
    }
  }

  constructor(
    private router: Router,
    private shortcutService: ShortcutService,
    private salesStore: Store<fromSales.SalesState>,
    private quickSelectsStore: Store<fromQuickSelects.QuickSelectsState>,
    private notificationService: NotificationService,
    private saleStore: Store<fromSale.SalesState>,
    private appContextManager: AppContextManager,
    private deviceHubService: DeviceHubService,
    private modalService: NgbModal,
    private appSettingService: AppSettingService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.loadShortcuts();
    this.initSelectors();
    this.getCategories();
  }

  onDestroy() {

  }

  public onClickCategory(id) {
    this.selectedCategoryId = id;
    this.getVariantsByCategories();
  }

  public onClickCategoryPrevious() {
    if (this.categoryPageIndex > 0) {
      this.categoryPageIndex--;
      this.getCategories();
    }
  }

  public onClickCategoryNext() {
    if ((this.categoryPageIndex + 1) * this.categoryPageSize < this.categoryTotalItems) {
      this.categoryPageIndex++;
      this.getCategories();
    }
  }

  public onClickProduct(id) {
    const variant = this.variants.find(x => x.id === id);
    if (variant) {
      this.salesStore.dispatch(new salesActions.AddSaleItem(variant));
    }
  }

  public onClickProductPrevious() {
    if (this.variantPageIndex > 0) {
      this.variantPageIndex--;
      this.getVariantsByCategories();
    }
  }

  public onClickProductNext() {
    if ((this.variantPageIndex + 1) * this.variantPageSize < this.variantTotalItems) {
      this.variantPageIndex++;
      this.getVariantsByCategories();
    }
  }

  public onClickFeature(id) {
    const selectedFeature = this.featuresBigButtons.find(x => x.id === id);

    if (selectedFeature && selectedFeature.id === FeatureConstants.PickupOrders) {
      this.router.navigateByUrl(`/${PageConstants.pickupOrder}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.OpenDay) {
      this.router.navigateByUrl(`/${PageConstants.openDay}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.CloseDay) {
      this.router.navigateByUrl(`/${PageConstants.closeDay}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.RecentSales) {
      this.router.navigateByUrl(`/${PageConstants.recentSales}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.PendingSales) {
      this.router.navigateByUrl(`/${PageConstants.pendingSales}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.ManageShortcut) {
      this.router.navigateByUrl(`/${PageConstants.appSetting}`);
      return;
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.StockAndPriceLookup) {
      this.router.navigateByUrl('/stock-price');
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.FederateSearchStock) {
      this.router.navigateByUrl(`/${PageConstants.federateSearchStock}`);
    }

    if (selectedFeature && selectedFeature.id === FeatureConstants.CustomerManagement) {
      this.router.navigateByUrl('/customer-management');
    }
  }

  public onClickShortKey(id) {
    const selectedShortkey = this.shortKeysBigButtons.find(x => x.id === id);
    if (!selectedShortkey) {
      return;
    }

    if (selectedShortkey.id === ShortKeyConstants.SaveSale) {
      this.savePendingSale();
      return;
    }

    if (selectedShortkey.id === ShortKeyConstants.NewSale) {
      this.onNewSale();
    }

    if (selectedShortkey.id === ShortKeyConstants.Promotion) {
      this.router.navigateByUrl(`/${PageConstants.promotion}`);
    }

    if (selectedShortkey.id === ShortKeyConstants.OpenCashDrawer) {
      this.appSettingService.getByKey(SystemAppSettingKeys.printerShareName).subscribe((appSeting) => {
        const printerShareName = appSeting ? appSeting.value : '\\\\desktop-6g05lnd\\receipt';
        this.deviceHubService.openCashDrawer(printerShareName).subscribe(() => {
          this.notificationService.success('Opened Cash Drawer');
        });
      });
    }
  }

  public onClickFunction(id) {
    const selectedFunction = this.functionsBigButtons.find(x => x.id === id);
    if (selectedFunction && selectedFunction.id === FunctionConstants.Payment) {
      this.router.navigateByUrl(`/${PageConstants.payment}`);
    }
  }

  private loadShortcuts() {
    this.shortcutService.quickSelectShortcutsSubject.subscribe(shortcuts => {
      this.shortcuts = shortcuts;
      this.mapShortcutsToQuickSelectGrid();
    });

    this.shortcutService.loadShortcutsByPage(PageConstants.quickSelect);
  }

  private mapShortcutsToQuickSelectGrid() {
    this.mapShortcutsToGrid(this.featuresBigButtons, this.pageShortcutIds.features, this.gridNames.feature);
    this.mapShortcutsToGrid(this.shortKeysBigButtons, this.pageShortcutIds.shortKeys, this.gridNames.shortKey);
    this.mapShortcutsToGrid(this.functionsBigButtons, this.pageShortcutIds.functions, this.gridNames.function);
  }

  private mapShortcutsToGrid(buttons: BigButton[], shortcutIds: string[], gridName: string) {
    shortcutIds.forEach(shortcutId => {
      const mappingShortcut = this.shortcuts.find(x => x.key === shortcutId);
      const button = buttons.find(x => x.id === shortcutId);

      if (mappingShortcut && button) {
        button.shortKey = mappingShortcut.shortcut;
        this.mappingShortcuts.push({
          id: shortcutId, shortcutKey: mappingShortcut.shortcut.toLowerCase(), gridName: gridName
        });
      }
    });
  }

  private initSelectors() {
    this.handleSubscription(
      this.salesStore.pipe(select(fromSaleSelector.getCustomer)).subscribe(customer => {
        this.customer = customer;

        this.buildVariantsSources();
      })
    );

    this.handleSubscription(
      this.salesStore.pipe(select(fromSaleSelector.getProducts)).subscribe(products => {
        this.products = products;
      })
    );

    this.handleSubscription(
      this.quickSelectsStore.pipe(select(quickSelectSelector.getCategories)).subscribe(categories => {
        if (categories) {
          this.categoriesBigButtons = categories.map(category => new BigButton({
            id: category.id, width: 100, height: 100, colspan: 1, title: category.name
          }));
        }
      })
    );

    this.handleSubscription(
      this.quickSelectsStore.pipe(select(quickSelectSelector.getCategoryTotalItems)).subscribe(totalItems => {
        this.categoryTotalItems = totalItems;
      })
    );

    this.handleSubscription(
      this.quickSelectsStore.pipe(select(quickSelectSelector.getCategory)).subscribe(category => {
        if (category) {
          this.selectedCategoryId = category.id;
          this.getVariantsByCategories();
        }
      })
    );

    this.handleSubscription(
      this.quickSelectsStore.pipe(select(quickSelectSelector.getVariants)).subscribe(variants => {
        if (variants) {
          this.variants = variants;

          this.buildVariantsSources();
        }
      })
    );

    this.handleSubscription(
      this.quickSelectsStore.pipe(select(quickSelectSelector.getVariantTotalItems)).subscribe(totalItems => {
        this.variantTotalItems = totalItems;
      })
    );

    this.pageActive = this.appContextManager.validActivedScreen(ActivatedScreen.QuickSelect);
  }

  private getCategories() {
    this.quickSelectsStore.dispatch(new quickSelectActions.GetCategoriesPaging({
      pageIndex: this.categoryPageIndex,
      pageSize: this.categoryPageSize
    }));
  }

  private getVariantsByCategories() {
    this.appSettingService.getByKey(SystemAppSettingKeys.storeId).subscribe(storeIdAppSetting => {
      this.quickSelectsStore.dispatch(new quickSelectActions.GetVariantsByCategoriesPaging({
        categoryIds: [this.selectedCategoryId],
        locationId: storeIdAppSetting ? storeIdAppSetting.value : '',
        pageIndex: this.variantPageIndex,
        pageSize: this.variantPageSize
      }));
    });
  }

  private onNewSale() {
    if (this.isOpeningNewSalePopup) {
      return;
    }
    const dialogRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;
    instance.title = 'Confirm';
    instance.message = 'Are you sure you want to clear all inputs data?';

    this.isOpeningNewSalePopup = true;
    dialogRef.result.then((result) => {
      this.isOpeningNewSalePopup = false;
      if (result === ConFirmDialogResult.Yes) {
        this.salesStore.dispatch(new salesActions.ClearData());
      }
    }, (reason) => {
      this.isOpeningNewSalePopup = false;
    });
  }

  private buildVariantsSources() {
    this.productsBigButtons = this.variants.map(variant => {
      const appliedVariantPrice = this.customer ? variant.memberPrice : variant.listPrice;

      return new BigButton({
        id: variant.id, width: 100, height: 100, colspan: 1, title: variant.description, caption: appliedVariantPrice.toFixed(2)
      });
    });
  }

  private savePendingSale() {
    if (!(Array.isArray(this.products) && this.products.length > 0)) {
      this.notificationService.error('Nothing to save!');
      return;
    }

    const pendingSale = new PendingSale();
    pendingSale.customerId = this.customer ? this.customer.id : null;
    pendingSale.createdDate = new Date();
    pendingSale.amount = 0;

    const pendingSaleItems = this.products.map(product => {
      const pendingSaleItem = new PendingSaleItem();
      pendingSaleItem.priceId = product.priceId;
      pendingSaleItem.stockTypeId = product.stockTypeId;
      pendingSaleItem.variantId = product.variantId;
      pendingSaleItem.quantity = product.quantity;
      pendingSaleItem.amount = 0;

      return pendingSaleItem;
    });

    const pendingSaleData = {
      pendingSale: pendingSale,
      pendingSaleItems: pendingSaleItems
    };

    this.saleStore.dispatch(new salesActions.AddPendingSale(pendingSaleData));
    this.salesStore.dispatch(new salesActions.ClearData());
  }

}
