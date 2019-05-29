import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ItemNavbar } from 'src/app/shared/components/navbar/nav-item.model';
import { Store, select } from '@ngrx/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as fromRoot from '../shared/state/app.state';
import * as fromAuths from '../shared/components/auth/state';
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
    private store: Store<fromRoot.State>
  ) {
    this.configureWithNewConfigApi();
  }

  MenuItems = null;


  ListItem: any = [];
  activeLink = 'Purchase Order';
  title = 'PURCHASE ORDER APP';
  userName = '';
  userRole = null;
  logo = '/assets/img/300_dpi_white.png';

  purchaserMenuItems = [];
  purchaseManagerMenuItems = [];
  inventoryManagerItems = [];

  ngOnInit() {
    this.store
      .pipe(select(fromAuths.getUserName))
      .subscribe(userName => (this.userName = userName));
    this.store
      .pipe(select(fromAuths.getUserRole))
      .subscribe(userRole => {
        this.userRole = userRole;
        if (this.userRole) {
          if (this.userRole.includes(UserRole.InventoryManager)) {
            this.inventoryManagerItems = [
              {
                label: 'PIM',
                link: environment.app.ims.url,
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
                url: 'vendors',
                link: '',
                subMenu: [
                  { label: 'Vendors', url: 'vendors' },
                  { label: 'Purchase Orders', url: 'purchase-orders' },
                  { label: 'Return Orders', url: 'return-orders' },
                  { label: 'Approvals', url: 'approvals' }
                ]
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              }
            ];
          }
          if (this.userRole.includes(UserRole.Purchaser)) {
            this.purchaserMenuItems = [
              {
                label: 'Purchase Order',
                url: 'vendors',
                link: '',
                subMenu: [
                  { label: 'Vendors', url: 'vendors' },
                  { label: 'Purchase Orders', url: 'purchase-orders' },
                  { label: 'Return Orders', url: 'return-orders' },
                ]
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              }
            ];
          }
          if (this.userRole.includes(UserRole.PurchaseManager)) {
            this.purchaseManagerMenuItems = [
              {
                label: 'PIM',
                link: environment.app.ims.url,
                url: '',
                subMenu: []
              },
              {
                label: 'Purchase Order',
                url: 'vendors',
                link: '',
                subMenu: [
                  { label: 'Vendors', url: 'vendors' },
                  { label: 'Purchase Orders', url: 'purchase-orders' },
                  { label: 'Return Orders', url: 'return-orders' },
                  { label: 'Approvals', url: 'approvals' }
                ]
              },
              {
                label: 'Report',
                link: `${environment.app.retail.url}/report`,
                url: '',
                subMenu: []
              }
            ];
          }
          if (this.userRole.includes(UserRole.Administrator)) {
            this.MenuItems = [
              {
                label: 'PIM',
                link: environment.app.ims.url,
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
                link: '',
                url: 'vendors',
                subMenu: [
                  { label: 'Vendors', url: 'vendors' },
                  { label: 'Purchase Orders', url: 'purchase-orders' },
                  { label: 'Return Orders', url: 'return-orders' },
                  { label: 'Approvals', url: 'approvals' }
                ]
              },
              {
                label: 'Retail',
                link: `${environment.app.retail.url}/retail`,
                url: '',
                subMenu: []
              },
              {
                label: 'Promotion',
                link: `${environment.app.promotion.url}`,
                url: '',
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

          if (!this.MenuItems) {
            this.MenuItems = this.getMenu(_.uniq([ ...this.inventoryManagerItems, ...this.purchaseManagerMenuItems,
                                                  ...this.purchaserMenuItems ]));
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

  private configureWithNewConfigApi() {
    this.oauthService.configureWithNewConfigApi();
    this.oauthService.login();
  }
}
