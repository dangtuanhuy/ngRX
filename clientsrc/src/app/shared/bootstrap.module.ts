import {NgModule} from '@angular/core';
import { NgbModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot()
  ],
  exports: [
  ]
})
export class BootstrapModule {
}
