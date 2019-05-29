import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class NotificationService {
    constructor(private toastr: ToastrService) {
    }

    public success(text: string) {
        this.toastr.success(text);
    }

    public error(text: string) {
        this.toastr.error(text);
    }

    public warning(text: string) {
        this.toastr.warning(text);
    }
}
