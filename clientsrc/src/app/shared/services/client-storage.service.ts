import { Injectable } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';

@Injectable()
export class ClientStorageService {
    constructor(private oAuthStorage: OAuthStorage) {
    }

    public setLocalStorage(key: string, data: any): void {
        this.oAuthStorage.setItem(key, data);
    }

    public getLocalStorage(key: string): any {
        return this.oAuthStorage.getItem(key);
    }
}
