import { OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export abstract class ComponentBase implements OnInit, OnDestroy {
    private subscriptions: Array<Subscription> = [];
    isDeactive: boolean;
    hiddenLoadingIndicator = true;
    loadingIndicatorDescription = '';
    constructor(public injector: Injector) { }

    abstract onInit();
    abstract onDestroy();

    handleSubscription(item: Subscription): void {
        this.subscriptions.push(item);
    }

    ngOnInit(): void {
        this.onInit();
        const loaderService = this.injector.get(LoaderService);
        loaderService.activeSubject
            .subscribe((state: any) => {
                this.isDeactive = state;
                this.hiddenLoadingIndicator = !state;
            });
        loaderService.descriptionSubject
            .subscribe((description: string) => {
                this.loadingIndicatorDescription = description;
            });
    }

    ngOnDestroy(): void {
        this.onDestroy();
        this.subscriptions.forEach(item => {
            item.unsubscribe();
        });
    }
}
