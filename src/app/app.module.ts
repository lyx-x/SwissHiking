import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { SearchComponent } from './search/search.component';
import { StatsComponent } from './stats/stats.component';
import { StatsService } from "./stats/stats.service";


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
