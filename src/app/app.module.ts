 import { BrowserModule } from '@angular/platform-browser';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { NgModule } from '@angular/core';
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
   NbCheckboxModule
 } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './pages/login/login.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

 @NgModule({
   declarations: [AppComponent, LoginComponent],
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
     NbCheckboxModule
   ],
   bootstrap: [AppComponent],
 })
 export class AppModule {
 }
 