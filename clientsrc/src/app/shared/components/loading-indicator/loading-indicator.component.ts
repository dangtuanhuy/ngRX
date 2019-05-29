import { Component, Injector} from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent extends ComponentBase {

  show = true;

  constructor(private loaderService: LoaderService, public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.loaderService.loaderSubject
      .subscribe((state: any) => {
        this.show = state;
      });
  }

  onDestroy() {
  }
}
