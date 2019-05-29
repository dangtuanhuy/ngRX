import { Component, ViewChild, ViewEncapsulation, Injector, ElementRef } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { LocationModel } from '../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { DashboardModel, DashboardItemModel, DashboardItemDetailModel, DashboardRequestModel } from './dashboard.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends ComponentBase {

  public locations: Array<LocationModel> = [];
  public wareHouses: Array<LocationModel> = [];
  public outlets: Array<LocationModel> = [];
  public isLocationsLoading = true;
  public selectedLocation: LocationModel = null;
  @ViewChild('stocksTable') stockTable: any;
  public stocksDashboard: DashboardModel = {
    locationId: null,
    locationName: '',
    items: []
  };
  public isLoadingInventoryStock = false;
  public pageSize = 10;
  public pageNumber = 1;
  private hubConnection: HubConnection;
  public isShowLocationName = false;
  public searchText = '';
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  constructor(private locationService: LocationService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.getLocations();
    this.addKeyUpEventToSearchText();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.app.ims.apiUrl}/stock-level`)
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.hubConnection.start().catch(err => console.log(err));
    this.hubConnection.on('BroadcastMessage', (stockLevels: any[]) => {
      if (this.selectedLocation && this.selectedLocation.id && this.selectedLocation.id !== Guid.empty()) {
        this.isShowLocationName = false;
        if (stockLevels.length > 0) {
          stockLevels.forEach(stockItem => {
            if (this.selectedLocation.id === stockItem.locationId) {
              if (this.stocksDashboard.items.length === 0) {
                this.addNewProduct(stockLevels, stockItem.productId);
              } else {
                if (!this.stocksDashboard.items.some(x => x.productId === stockItem.productId)) {
                  this.addNewProduct(stockLevels, stockItem.productId);
                } else {
                  const productIndex = this.stocksDashboard.items.findIndex(x => x.productId === stockItem.productId);
                  if (!this.stocksDashboard.items[productIndex].items.some(x => x.variantId === stockItem.variantId)) {
                    this.addNewVariant(stockItem, productIndex);
                  } else {
                    const variantIndex = this.stocksDashboard.items[productIndex]
                      .items.findIndex(x => x.variantId === stockItem.variantId);
                    this.stocksDashboard.items[productIndex].items[variantIndex].balance = stockItem.balance;
                  }
                }
              }
            }
          });
        }
      } else {
        this.isShowLocationName = true;
        if (stockLevels.length > 0) {
          stockLevels.forEach(stockItem => {
            if (this.stocksDashboard.items.length === 0) {
              this.addNewProduct(stockLevels, stockItem.productId);
            } else {
              if (!this.stocksDashboard.items.some(x => x.productId === stockItem.productId)) {
                this.addNewProduct(stockLevels, stockItem.productId);
              } else {
                const productIndex = this.stocksDashboard.items.findIndex(x => x.productId === stockItem.productId);
                if (!this.stocksDashboard.items[productIndex].items.some(x => x.variantId === stockItem.variantId)) {
                  this.addNewVariant(stockItem, productIndex);
                } else {
                  const variantIndex = this.stocksDashboard.items[productIndex]
                    .items.findIndex(x => x.variantId === stockItem.variantId);
                  this.stocksDashboard.items[productIndex].items[variantIndex].balance = stockItem.balance;
                }
              }
            }
          });
        }
      }
    });
  }

  private addNewProduct(locationStocks: any[], productId: string) {
    this.isLoadingInventoryStock = true;
    const stockNewProducts = locationStocks.filter(item => item.productId === productId);
    if (stockNewProducts.length > 0) {
      const stockVariants: DashboardItemDetailModel[] = [];
      stockNewProducts.forEach(stock => {
        const newVariant: DashboardItemDetailModel = {
          variantId: stock.variantId,
          locationId: stock.locationId,
          locationName: stock.locationName,
          balance: stock.balance,
          fields: stock.fields,
          sKUCode: stock.skuCode
        };
        stockVariants.push(newVariant);
      });

      const newStockProduct: DashboardItemModel = {
        productId: stockNewProducts[0].productId,
        productName: stockNewProducts[0].productName,
        items: stockVariants
      };

      const arrayTemp = [...this.stocksDashboard.items, newStockProduct];
      this.stocksDashboard.items = [];
      this.stocksDashboard.items = arrayTemp;
    }
    this.isLoadingInventoryStock = false;
  }

  private addNewVariant(variantStock: any, productIndex: number) {
    this.isLoadingInventoryStock = true;
    const newVariant: DashboardItemDetailModel = {
      variantId: variantStock.variantId,
      locationId: variantStock.locationId,
      locationName: variantStock.locationName,
      balance: variantStock.balance,
      fields: variantStock.fields,
      sKUCode: variantStock.skuCode
    };
    const arrayTemp = [...this.stocksDashboard.items[productIndex].items, newVariant];
    this.stocksDashboard.items[productIndex].items = [];
    this.stocksDashboard.items[productIndex].items = arrayTemp;
    this.isLoadingInventoryStock = false;
  }

  onDestroy() {

  }

  public getInventoryStock(locationId: string, queryText: string) {
    if (this.selectedLocation.id === Guid.empty()) {
      this.isShowLocationName = true;
    } else {
      this.isShowLocationName = false;
    }
    this.isLoadingInventoryStock = true;
    this.stocksDashboard = {
      locationId: locationId,
      locationName: '',
      items: []
    };
    const request: DashboardRequestModel = {
      locationId: locationId,
      queryText: queryText
    };
    this.dashboardService.getByLocation(request).subscribe(res => {
      this.stocksDashboard = res;
      this.isLoadingInventoryStock = false;
    });
  }

  public onSelectedLocationChange(e) {
    if (this.selectedLocation) {
      this.getInventoryStock(this.selectedLocation.id, this.searchText);
    } else {
      this.notificationService.error('You need select location. Please try again!');
    }
  }

  private getLocations() {
    this.isLocationsLoading = true;
    const emptyLocation: LocationModel = {
      id: Guid.empty(),
      address: '',
      contactPerson: '',
      locationCode: '',
      name: 'All locations',
      phone1: '',
      phone2: '',
      type: null
    };
    this.locationService.getAllWithoutPaging().subscribe(res => {
      this.locations.push(emptyLocation);
      this.locations = [...this.locations, ...res];
      this.isLocationsLoading = false;
    });
  }

  public setPage(e: any) {
    this.pageNumber += 1;
  }

  public toggleExpandStocksRow(row: any) {
    this.stockTable.rowDetail.toggleExpandRow(row);
  }

  public expandAllStocksRows() {
    this.stockTable.rowDetail.expandAllRows();
  }

  public collapseAllStocksRows() {
    this.stockTable.rowDetail.collapseAllRows();
  }

  public getFieldName(variants: DashboardItemModel) {
    if (variants && variants.items.length > 0 && variants.items[0].fields.length > 0) {
      return variants.items[0].fields;
    }
  }

  addKeyUpEventToSearchText() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .subscribe(() => {
        this.getInventoryStock(this.selectedLocation.id, this.searchText);
      });
  }
}
