import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {NavbarComponent} from "./core/navbar/navbar.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ExchangeRateComponent} from "./exchange-rate/exchange-rate.component";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NavbarComponent,
    BrowserAnimationsModule,
    ExchangeRateComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
