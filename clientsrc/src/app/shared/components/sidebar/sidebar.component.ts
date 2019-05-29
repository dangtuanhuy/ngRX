import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class SidebarComponent {
  constructor(config: NgbDropdownConfig,
    private oauthService: AuthService) {
    config.autoClose = false;
  }
  @Input()
  ListItem: Array<any> = [];

  @Input()
  userName;

  @Input()
  ListItemMobile: Array<any> = [];
  @Output() clickBtn = new EventEmitter<any>();

  isActive = false;
  showMenu = '';
  pushRightClass = 'push-right';

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  isToggled(): boolean {
    const dom = document.querySelector('body');
    return dom ? dom.classList.contains(this.pushRightClass) : false;
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  onClick(e: any) {
    this.clickBtn.emit(e);
  }

  public logout(e: any) {
    this.oauthService.logout();
  }
}
