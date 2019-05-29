import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesModule } from './sales/sales.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FakeService } from './shared/services/fake.service';
import { ShortcutService } from './shared/services/shortcut.service';
import { PosCommonModule } from './shared/pos-common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SalesService } from './shared/services/sales.service';
import { MatKeyboardModule } from './shared/components/keyboard/keyboard.module';
import { KeyboardService } from './shared/components/keyboard/services/keyboard.service';
import { DeviceAuthenticationComponent } from './auth/device-authentication/device-authentication.component';
import { SyncDataComponent } from './contents/sync-data/sync-data.component';
import { SharedPosModule } from '../shared/shared-pos.module';
import { LoaderService } from '../shared/services/loader.service';
import { PosLoadingSpinnerModule } from './contents/pos-loading-spinner/pos-loading-spinner.module';
import { LoggingService } from '../shared/services/logging.service';
import { SalesToolbarComponent } from './sales/sales-toolbar/sales-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DeviceAuthenticationComponent,
    SyncDataComponent,
    SalesToolbarComponent
  ],
  exports: [
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'POS App DevTools',
      maxAge: 25,
      logOnly: environment.production,
    }),
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    SalesModule,
    MatKeyboardModule,
    PosCommonModule,
    NgxDatatableModule,
    SharedPosModule,
    PosLoadingSpinnerModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    FakeService,
    ShortcutService,
    KeyboardService,
    SalesService,
    LoaderService,
    LoggingService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
