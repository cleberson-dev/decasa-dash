 import { BrowserModule } from '@angular/platform-browser';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { HttpClientModule } from '@angular/common/http';
 import { CoreModule } from './@core/core.module';
 import { ThemeModule } from './@theme/theme.module';
 import { AppComponent } from './app.component';
 import { AppRoutingModule } from './app-routing.module';
 import {
   NbChatModule,
   NbDatepickerModule,
   NbDialogModule,
   NbMenuModule,
   NbSidebarModule,
   NbToastrModule,
   NbWindowModule,
   NbCardModule,
   NbLayoutModule,
   NbInputModule,
   NbIconModule,
   NbButtonModule,
   NbCheckboxModule,
   NbPopoverModule,
   NbSelectModule,
   NbAutocompleteModule,
 } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './pages/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as fromProdutosPlataforma from './store/reducers/produtos-plataforma.reducers';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { APP_BASE_HREF } from '@angular/common';
import { IMaskModule } from 'angular-imask';

@NgModule({
   declarations: [AppComponent, LoginComponent, RegistrarComponent],
   imports: [
     BrowserModule,
     BrowserAnimationsModule,
     HttpClientModule,
     AppRoutingModule,
     NbSidebarModule.forRoot(),
     NbMenuModule.forRoot(),
     NbDatepickerModule.forRoot(),
     NbDialogModule.forRoot(),
     NbWindowModule.forRoot(),
     NbToastrModule.forRoot(),
     NbChatModule.forRoot({
       messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
     }),
     CoreModule.forRoot(),
     ThemeModule.forRoot(),
     NbEvaIconsModule,
     NbCardModule,
     NbLayoutModule,
     NbInputModule,
     NbIconModule,
     NbButtonModule,
     NbCheckboxModule,
     StoreModule.forRoot({ produtosPlataforma: fromProdutosPlataforma.reducer }),
     ReactiveFormsModule,
     IMaskModule,
     NbPopoverModule,
     NbSelectModule,
     NbAutocompleteModule,
   ],
   bootstrap: [AppComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   providers: [
    { provide: APP_BASE_HREF, useValue: '/dashboard' }
  ]
 })
 export class AppModule {
 }
 