import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { MapComponent } from "./map/map.component";

const appRoutes: Routes = [
  { path: '', component: MapComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
