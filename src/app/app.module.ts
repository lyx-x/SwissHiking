import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppRoutingModule } from './app-routing.module';
import { TrackService } from './track/track.service';
import { MatchKeyPipe } from "./track/track.pipe";
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MatchKeyPipe,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [TrackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
