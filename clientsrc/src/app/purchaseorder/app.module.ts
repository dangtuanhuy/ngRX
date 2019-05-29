import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from 'src/app/purchaseorder/app.component';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from 'src/app/shared/components/auth/auth.module';
import { AuthGuard } from '../shared/components/auth/auth.guard';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { PurchaseOrderComponent } from './purchase-orders/purchase-order.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    BootstrapModule,
    SharedModule,
    AuthModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'Purchase Order App DevTools',
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [AuthGuard]
})
export class AppModule { }
