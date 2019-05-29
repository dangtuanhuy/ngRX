import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { Observable } from 'rxjs';
import { User } from '../base-model/user.model';

@Injectable({ providedIn: 'root' })
export class AccountService extends ServiceBase {

    getAll(): Observable<User[]> {
        return this.get(`${environment.idsApiUrl}/api/users`);
    }
}
