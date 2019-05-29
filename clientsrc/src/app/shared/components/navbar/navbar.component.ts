import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ItemNavbar } from 'src/app/shared/components/navbar/nav-item.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private oauthService: AuthService,
    public router: Router) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  pushRightClass = 'push-right';
  @Input()
  MenuItems = [];
  @Input()
  title = '';
  @Input()
  userName;
  @Input()
  logo = '';
  @Output() clickBtn = new EventEmitter<any>();


  public logout(e: any) {
    this.oauthService.logout();
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
}
