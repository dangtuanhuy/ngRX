import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as fromRoot from '../shared/state/app.state';
import * as fromAuths from '../shared/components/auth/state';
import { LoaderService } from '../shared/services/loader.service';
import { environment } from 'src/environments/environment';

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

  ListItem: any = [];
  activeLink = 'Promotions';
  title = 'PROMOTION APP';
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
          if (this.userRole.includes('SalesManager')) {
            this.MenuItems = [
              {
                label: 'Retail',
                link: `${environment.app.retail.url}`,
                url: '',
                subMenu: []
              },
              {
                label: 'Promotion',
                url: 'discount-promotion',
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
          if (this.userRole.includes('Administrator')) {
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
                  link: `${environment.app.retail.url}`,
                  url: '',
                  subMenu: []
                },
                {
                  label: 'Promotion',
                  url: 'discount-promotion',
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

          this.initSubMenu();
        }
      });
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
