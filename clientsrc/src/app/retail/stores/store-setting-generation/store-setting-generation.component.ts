import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/stores.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-store-setting-generation',
    templateUrl: './store-setting-generation.component.html',
    styleUrls: ['./store-setting-generation.component.scss']
})
export class StoreSettingGenerationComponent implements OnInit {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private storeService: StoreService) { }

    ngOnInit() {
        this.storeService.generateStoreSettings().subscribe(x => {
            this.notificationService.success('success');
            this.router.navigateByUrl('/retail');
        });
    }
}
