import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ConcursosComponent } from './concursos/concursos.component';
import { SummaryComponent } from './summary/summary.component';
import { VoicesComponent } from './voices/voices.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
  ConcursosComponent,
  SummaryComponent,
  VoicesComponent,
  ProfileComponent],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: []
})
export class PagesModule { }
