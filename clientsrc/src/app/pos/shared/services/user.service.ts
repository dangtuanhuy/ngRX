import { Injectable } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ServiceBase } from 'src/app/shared/services/service-base';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService extends ServiceBase {
    constructor(
        http: HttpClient,
        notificationService: NotificationService,
    ) {
        super(http, notificationService);
    }
}
