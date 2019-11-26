import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { DataService } from './data.service';

import { AgGridModule } from '@ag-grid-community/angular';

@NgModule({
  imports: [BrowserModule, AgGridModule.withComponents()],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ DataService ]
})
export class AppModule { }
