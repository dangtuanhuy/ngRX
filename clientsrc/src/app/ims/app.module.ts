import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from 'src/app/ims/app.component';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from 'src/app/shared/components/auth/auth.module';
import { AuthGuard } from '../shared/components/auth/auth.guard';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoaderService } from '../shared/services/loader.service';
import { SharedStateModule } from '../shared/shared-state.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Resolver } from './app.resolve';

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
    NgbDropdownModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'IMS App DevTools',
      maxAge: 25,
      logOnly: environment.production
    }),
    SharedStateModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [AuthGuard, LoaderService, Resolver]
})
export class AppModule { }
