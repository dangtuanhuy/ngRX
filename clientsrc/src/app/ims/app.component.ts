import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as fromRoot from '../shared/state/app.state';
import * as fromAuths from '../shared/components/auth/state';
import { LoaderService } from '../shared/services/loader.service';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/constant/user-role.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    private oauthService: AuthService,
    private store: Store<fromRoot.State>,
    private loaderService: LoaderService
  ) {
    this.configureWithNewConfigApi();
  }

  MenuItems: any;

  ListItem: any = [];
  activeLink = 'PIM';
  title = 'IMS APP';
  userId = '';
  userName = '';
  logo = '/assets/img/300_dpi_white.png';
  userRole = null;

  purchaseManagerMenuItems = [];
  inventoryManagerItems = [];
  warehouseKeeperItems = [];
  adminStaff = [];
  administrator = [];
  ngOnInit() {
    this.loaderService.show();
    this.store
      .pipe(select(fromAuths.getUserName))
      .subscribe(userName => (this.userName = userName));

    this.store
      .pipe(select(fromAuths.getUserId))
      .subscribe(userId => {
        this.userId = userId;
        if (userId) {
          this.loaderService.hide();
        }
      });
    this.store
      .pipe(select(fromAuths.getUserRole))
      .subscribe(userRole => {
        this.userRole = userRole;
        if (this.userRole) {
          if (this.userRole.includes(UserRole.PurchaseManager)) {
            this.purchaseManagerMenuItems = [
              {
                label: 'PIM',
                url: 'products',
                subMenu: [
                  { label: 'Products', url: 'products' },
                  { label: 'Categories', url: 'categories' },
                  { label: 'Brands', url: 'brands' },
                  { label: 'Fields', url: 'fields' },
                  { label: 'Field Templates', url: 'field-templates' }
                ]
              },
              {
                label: 'Purchase Order',
                url: 'purchase-order',
                subMenu: []
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              },
            ];
          }
          if (this.userRole.includes(UserRole.InventoryManager)) {
            this.inventoryManagerItems = [
              {
                label: 'PIM',
                url: 'products',
                subMenu: [
                  { label: 'Products', url: 'products' },
                  { label: 'Categories', url: 'categories' },
                  { label: 'Brands', url: 'brands' },
                  { label: 'Fields', url: 'fields' },
                  { label: 'Field Templates', url: 'field-templates' },
                  { label: 'Assortments', url: 'assortments' },
                  { label: 'Locations', url: 'locations' }
                ]
              },
              {
                label: 'Inventory stocks',
                url: 'dashboard',
                subMenu: [
                  { label: 'Dashboard', url: 'dashboard' },
                  { label: 'Stock Initial', url: 'stock-initial' },
                  { label: 'Goods Inward', url: 'goods-inward' },
                  { label: 'Goods Return', url: 'goods-return' },
                  { label: 'Stock Allocation', url: 'stock-allocation' },
                  { label: 'Transfer Outs', url: 'transfer-outs' },
                  { label: 'Transfer Ins', url: 'transfer-ins' },
                  { label: 'Reasons', url: 'reasons' }
                ]
              },
              {
                label: 'Purchase Order',
                url: 'purchase-order',
                subMenu: []
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              }
            ];
          }
          if (this.userRole.includes(UserRole.WarehouseStaff)) {
            this.warehouseKeeperItems = [
              {
                label: 'Inventory stocks',
                url: 'dashboard',
                subMenu: [
                  { label: 'Dashboard', url: 'dashboard' },
                  { label: 'Goods Inward', url: 'goods-inward' },
                  { label: 'Goods return', url: 'goods-return' },
                  { label: 'Transfer Outs', url: 'transfer-outs' },
                  { label: 'Transfer Ins', url: 'transfer-ins' },
                  { label: 'Stock Request', url: 'stock-request' }]
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              },
            ];
          }
          if (this.userRole.includes(UserRole.AdminStaff)) {
            this.adminStaff = [
              {
                label: 'Inventory stocks',
                url: 'transfer-outs',
                subMenu: [
                  { label: 'Dashboard', url: 'dashboard' },
                  { label: 'Transfer Outs', url: 'transfer-outs' },
                  { label: 'Transfer Ins', url: 'transfer-ins' },
                  { label: 'Reasons', url: 'reasons' },
                  { label: 'Stock Request', url: 'stock-request' }]
              }
            ];
          }
          if (this.userRole.includes('Administrator')) {
            this.MenuItems = [
              {
                label: 'PIM',
                url: 'products',
                subMenu: [
                  { label: 'Products', url: 'products' },
                  { label: 'Categories', url: 'categories' },
                  { label: 'Brands', url: 'brands' },
                  { label: 'Fields', url: 'fields' },
                  { label: 'Field Templates', url: 'field-templates' },
                  { label: 'Assortments', url: 'assortments' },
                  { label: 'Locations', url: 'locations' },
                  { label: 'Channels', url: 'channels' }]
              },
              {
                label: 'Inventory stocks',
                url: 'dashboard',
                subMenu: [
                  { label: 'Dashboard', url: 'dashboard' },
                  { label: 'Stock Initial', url: 'stock-initial' },
                  { label: 'Goods Inward', url: 'goods-inward' },
                  { label: 'Goods return', url: 'goods-return' },
                  { label: 'Stock Allocation', url: 'stock-allocation' },
                  { label: 'Transfer Outs', url: 'transfer-outs' },
                  { label: 'Transfer Ins', url: 'transfer-ins' },
                  { label: 'Reasons', url: 'reasons' },
                  { label: 'Stock Request', url: 'stock-request' }]
              },
              {
                label: 'Purchase Order',
                url: 'purchase-order',
                subMenu: []
              },
              {
                label: 'Retail',
                url: 'retail',
                subMenu: []
              },
              {
                label: 'Promotion',
                url: 'promotion',
                subMenu: []
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              },
              {
                label: 'Admin',
                url: 'activities',
                subMenu: [{ label: 'Activities', url: 'activities' }]
              },
              {
                label: 'Settings',
                url: 'index',
                subMenu: [{ label: 'Index', url: 'index' }]
              }
            ];
          }

          if (!this.MenuItems) {
            this.MenuItems = this.getMenu(_.uniq([...this.inventoryManagerItems, ...this.purchaseManagerMenuItems,
                                                  ...this.warehouseKeeperItems, ...this.adminStaff]));
          }
          this.initSubMenu();
        }
      });
  }

  getMenu(menuItems: any[]): any[] {
    this.MenuItems = [];
    for (let x = 0; x < menuItems.length; x++) {
      const found = this.MenuItems.some(function (el) {
        return el.label === menuItems[x].label;
      });
      if (!found) {
        for (let y = x; y < menuItems.length; y++) {
          if (menuItems[x].label === menuItems[y].label) {
              menuItems[x].subMenu = _.uniqBy([...menuItems[x].subMenu, ...menuItems[y].subMenu], 'label');
          }
        }
        this.MenuItems.push(menuItems[x]);
      }
    }
    return this.MenuItems;
  }

  getSubmenu() {
    for (const item of this.MenuItems) {
      if (item.label === this.activeLink) {
        this.ListItem = item.subMenu;
        break;
      }
    }
  }

  private configureWithNewConfigApi() {
    this.oauthService.configureWithNewConfigApi();
    this.oauthService.login();
  }

  private initSubMenu() {
    const currentPage = window.location.pathname.replace('/', '');

    const selectedMenu = this.MenuItems.find(menuItem => {
      const subMenu = menuItem.subMenu.find(subItem => subItem.url === currentPage);
      if (subMenu) {
        return true;
      } else {
        return false;
      }
    });

    if (selectedMenu) {
      this.activeLink = selectedMenu.label;
    }

    this.getSubmenu();
  }

  switchFeature(e: any) {
    this.activeLink = e;
    this.getSubmenu();
  }
}
