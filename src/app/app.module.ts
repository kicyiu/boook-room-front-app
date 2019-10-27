import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PROVIDERS
import { DatePipe } from '@angular/common';
import { loggerProvider } from './providers/logger/logger.provider';
import { BaseServices } from './providers/base-services/base.service.provider';
import { AppConstants } from './constants/app-constants.constans';
import { GeneralServiceResponseProvider } from './providers/general-service-response/general.service.response';

import { FullCalendarModule } from '@fullcalendar/angular';

import { AppComponent } from './app.component';
import { EventModalComponent } from './components/event-modal/event-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxModalComponent } from './components/ngx-modal/ngx-modal.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    EventModalComponent,
    NgxModalComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [
    DatePipe,
    AppConstants,
    BaseServices,
    loggerProvider,
    GeneralServiceResponseProvider,
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgxModalComponent],
})
export class AppModule { }
