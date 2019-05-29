import { Component } from '@angular/core/src/metadata/directives';
import { ActionType } from '../constant/action-type.constant';

export class Button {
    constructor(button?: any) {
        if (!button) { return; }
        this.id = button.id;
        this.title = button.title;
        this.component = button.component;
        this.configDialog = button.configDialog;
        this.disable = button.disable;
        this.redirectUrl = button.redirectUrl;
        this.action = button.action;
        this.param = button.param;
        this.onClick = button.onClick;
    }
    public id = 0;
    public title = '';
    public component: Component;
    public configDialog: any;
    public disable: boolean;
    public redirectUrl: string;
    public action: ActionType;
    public param: any;
    public onClick?: any;
}
