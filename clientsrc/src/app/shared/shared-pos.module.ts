import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { InlineEditListViewComponent } from './components/inline-edit-list-view/inline-edit-list-view.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { BigButtonComponent } from './components/big-button/big-button.component';
import { ButtonsGridComponent } from './components/buttons-grid/buttons-grid.component';
import { PageCallbackComponent } from './components/page-callback/page-callback.component';
import { PosCommonModule } from '../pos/shared/pos-common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationService } from './services/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    PosCommonModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      disableTimeOut: false,
      tapToDismiss: false,
      toastClass: 'toast',
      closeButton: true
    })
  ],
  exports: [
    InlineEditListViewComponent,
    SearchComponent,
    BigButtonComponent,
    ButtonsGridComponent,
    PageCallbackComponent
  ],
  declarations: [
    InlineEditListViewComponent,
    SearchComponent,
    BigButtonComponent,
    ButtonsGridComponent,
    PageCallbackComponent
  ],
  providers: [NotificationService]
})
export class SharedPosModule {}
