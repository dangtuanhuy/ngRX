import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()

export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loaderService: LoaderService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.showLoader();
        this.deactivateItem();
        return next.handle(req).pipe(
            map(event => {
                this.hideLoader();
                if (event instanceof HttpResponse) {
                    this.activateItem();
                }
                return event;
            }),
            catchError(error => {
                this.hideLoader();
                this.activateItem();
                throw error;
            }));
    }

    private showLoader() {
        this.loaderService.show();
    }
    private hideLoader(): void {
        this.loaderService.hide();
    }

    private activateItem() {
        this.loaderService.activateItem();
    }

    private deactivateItem() {
        this.loaderService.deactivateItem();
    }
}
