import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoaderService {

    public loaderSubject = new EventEmitter<any>();
    public activeSubject = new EventEmitter<any>();
    public descriptionSubject = new EventEmitter<any>();
    loaderState = true;
    isDeactive = true;

    constructor() {

    }

    public show() {
        this.loaderState = true;
        this.loaderSubject.emit(this.loaderState);
        this.descriptionSubject.emit('');
    }

    public hide() {
        this.loaderState = false;
        this.loaderSubject.emit(this.loaderState);
    }

    public deactivateItem() {
        this.isDeactive = true;
        this.activeSubject.emit(this.isDeactive);
        this.descriptionSubject.emit('');
    }

    public activateItem() {
        this.isDeactive = false;
        this.activeSubject.emit(this.isDeactive);
    }

    public updateDescription(description: string) {
        this.descriptionSubject.emit(description);
    }
}
