import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListViewManagementComponent } from 'src/app/shared/components/list-view-management/list-view-management.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { ListViewComponent } from 'src/app/shared/components/list-view/list-view.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientStorageService } from 'src/app/shared/services/client-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { EntityAssignmentComponent } from './components/entity-assignment/entity-assignment.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { ValidationService } from './services/validation.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { VariantFieldSelectComponent } from './components/variant-field-select/variant-field-select.component';
import { StoreModule } from '@ngrx/store';
import { reducer as appReducer} from './state/app.reducer';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FilterMultiSelectComponent } from './components/filter-multi-select/filter-multi-select.component';

@NgModule({
  imports: [
    NgSelectModule,
    RouterModule,
    FormsModule,
    FormsModule,
    CommonModule,
    BootstrapModule,
    NgxDatatableModule,
    CommonModule,
    NgbModule.forRoot(),
    StoreModule.forFeature(`app`, appReducer),
    NgbDropdownModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      disableTimeOut: false,
      tapToDismiss: false,
      toastClass: 'toast',
      closeButton: true,
    }),
    NgDragDropModule.forRoot(),
  ],
  exports: [
    ListViewManagementComponent,
    ListViewComponent,
    NavbarComponent,
    SidebarComponent,
    EntityAssignmentComponent,
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    VariantFieldSelectComponent,
    FilterMultiSelectComponent
  ],
  declarations: [
    ListViewManagementComponent,
    ListViewComponent,
    NavbarComponent,
    SidebarComponent,
    EntityAssignmentComponent,
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    VariantFieldSelectComponent,
    FilterMultiSelectComponent
  ],
  providers: [
    ClientStorageService,
    AuthService,
    ValidationService,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    DatePipe
  ],
  entryComponents: [
    VariantFieldSelectComponent
  ]
})
export class SharedModule {

}
