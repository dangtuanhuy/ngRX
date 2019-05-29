import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserRepository } from '../shared/data/user-repository';
import { ServiceBase } from 'src/app/shared/services/service-base';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { User } from '../shared/models/user';
import { AppContextManager } from '../shared/app-context-manager';
import { PageConstants } from '../shared/constants/common.constant';

@Injectable()
export class AuthService extends ServiceBase {
    public loginSubcription = new Subject<any>();
    public isLoginSuccess = false;

    constructor(
        private router: Router,
        private userRepository: UserRepository,
        private appContextManager: AppContextManager,
        http: HttpClient,
        notificationService: NotificationService
    ) {
        super(http, notificationService);
    }

    public login(email: string, pin: string): User {
        const user = this.userRepository.pinSignIn(email, pin);

        if (!user) {
            return null;
        }

        this.router.navigate(['/']);
        this.isLoginSuccess = true;
        this.loginSubcription.next(this.isLoginSuccess);

        return user;
    }

    public logout() {
        this.appContextManager.setCurrentUser(null);
        this.isLoginSuccess = false;
        this.loginSubcription.next(this.isLoginSuccess);
        this.router.navigate([PageConstants.login]);
    }

    public isLoggedIn() {
        return this.isLoginSuccess;
    }
}
