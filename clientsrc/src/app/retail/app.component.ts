import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as fromRoot from '../shared/state/app.state';
import * as fromAuths from '../shared/components/auth/state';
import { LoaderService } from '../shared/services/loader.service';
import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/constant/user-role.constant';
import * as _ from 'lodash';

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

  MenuItems = [];
  saleManagerMenuItems = [];
  purchaserMenuItems = [];
  purchaseManagerMenuItems = [];
  inventoryManagerItems = [];
  wareHouseKeeperMenuItems = [];
  adminStaffMenuItems = [];

  ListItem: any = [];
  activeLink = 'Retail';
  title = 'RETAIL APP';
  userId = '';
  userName = '';
  logo = '/assets/img/300_dpi_white.png';

  userRole = null;

  ngOnInit() {
    this.loaderService.show();
    this.initSubMenu();
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
        if (this.userRole.includes(UserRole.SalesManager)) {
          this.saleManagerMenuItems = [
            {
              label: 'Retail',
              url: 'retail',
              subMenu: [
                { label: 'Devices', url: 'devices' },
                { label: 'Target', url: 'sale-target' },
                {label: 'Export sale transaction', url: 'export-sale-transaction-csv'}
              ]
            },
            {
              label: 'Promotion',
              link: `${environment.app.promotion.url}`,
              url: '',
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.Purchaser)) {
          this.purchaserMenuItems = [
            {
              label: 'Purchase Order',
              url: '',
              link: `${environment.app.purchaseOrder.url}/vendor`,
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.PurchaseManager)) {
          this.purchaseManagerMenuItems = [
            {
              label: 'PIM',
              link:  environment.app.ims.url,
              url: '',
              subMenu: []
            },
            {
              label: 'Purchase Order',
              url: '',
              link: `${environment.app.purchaseOrder.url}/vendor`,
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.InventoryManager)) {
          this.inventoryManagerItems = [
            {
              label: 'PIM',
              link:  environment.app.ims.url,
              url: '',
              subMenu: []
            },
            {
              label: 'Inventory stocks',
              link: `${environment.app.ims.url}/dashboard`,
              url: '',
              subMenu: []
            },
            {
              label: 'Purchase Order',
              url: '',
              link: `${environment.app.purchaseOrder.url}/vendor`,
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.WarehouseStaff)) {
          this.wareHouseKeeperMenuItems = [
            {
              label: 'Inventory stocks',
              link: `${environment.app.ims.url}/dashboard`,
              url: '',
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.AdminStaff)) {
          this.adminStaffMenuItems = [
            {
              label: 'Inventory stocks',
              link: `${environment.app.ims.url}/transfer-outs`,
              url: '',
              subMenu: []
            },
            {
              label: 'Report',
              url: 'report',
              subMenu: [
                { label: 'Report Target', url: 'report' },
                { label: 'Report Performance', url: 'report-sale-performance' }
              ]
            }
          ];
        }
        if (this.userRole.includes(UserRole.Administrator)) {
          this.MenuItems = [
              {
                label: 'PIM',
                link:  environment.app.ims.url,
                url: '',
                subMenu: []
              },
              {
                label: 'Inventory stocks',
                link: `${environment.app.ims.url}/dashboard`,
                url: '',
                subMenu: []
              },
              {
                label: 'Purchase Order',
                link: `${environment.app.purchaseOrder.url}`,
                url: '',
                subMenu: []
              },
              {
                label: 'Retail',
                url: 'retail',
                subMenu: [
                  { label: 'Devices', url: 'devices' },
                  { label: 'Target', url: 'sale-target' },
                  {label: 'Export sale transaction', url: 'export-sale-transaction-csv'}
                ]
              },
              {
                label: 'Promotion',
                link: `${environment.app.promotion.url}`,
                url: '',
                subMenu: []
              },
              {
                label: 'Report',
                url: 'report',
                subMenu: [
                  { label: 'Report Target', url: 'report' },
                  { label: 'Report Performance', url: 'report-sale-performance' }
                ]
              },
              {
                label: 'Admin',
                link: `${environment.app.ims.url}/activities`,
                url: '',
                subMenu: []
              },
              {
                label: 'Settings',
                link: `${environment.app.ims.url}/index`,
                url: '',
                subMenu: []
              },
          ];
        }

        if (this.MenuItems.length === 0) {
          this.MenuItems = this.getMenu(_.uniq([ ...this.inventoryManagerItems, ...this.purchaseManagerMenuItems,
                                                ...this.purchaserMenuItems, ...this.saleManagerMenuItems,
                                                ...this.wareHouseKeeperMenuItems, ...this.adminStaffMenuItems ]));
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

    const selectedMenu = this.MenuItems.find((menuItem: any) => {
      const subMenu = menuItem.subMenu.find((subItem: any) => subItem.url === currentPage);
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
