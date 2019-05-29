import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from 'src/app/retail/app.component';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from 'src/app/shared/components/auth/auth.module';
import { AuthGuard } from '../shared/components/auth/auth.guard';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoaderService } from '../shared/services/loader.service';
import { SharedStateModule } from '../shared/shared-state.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    BootstrapModule,
    SharedModule,
    AuthModule,
    NgbModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    NgbDropdownModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'Retail App DevTools',
      maxAge: 25,
      logOnly: environment.production
    }),
    SharedStateModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [AuthGuard, LoaderService]
})
export class AppModule { }
