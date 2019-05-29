import { OAuthResourceServerErrorHandler, OAuthService } from "angular-oauth2-oidc";
import { HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from "@angular/core";
@Injectable()
export class AuthResourceServerErrorHandler implements OAuthResourceServerErrorHandler {
    constructor(private oauthService: OAuthService) {

    }
    handleError(err: HttpResponse<any>): Observable<any> {
        if (err.status === 401) {
            this.oauthService.initImplicitFlow();
        } else {
            return throwError(err);
        }
    }
}
