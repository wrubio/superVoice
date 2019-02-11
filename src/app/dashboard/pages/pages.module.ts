import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { ConcursosComponent } from './concursos/concursos.component';
import { SummaryComponent } from './summary/summary.component';
import { VoicesComponent } from './voices/voices.component';
import { ProfileComponent } from './profile/profile.component';
import { NewContestComponent } from './new-contest/new-contest.component';
import { DASHBOARD_ROUTES } from '../dashboard.routes';

@NgModule({
  declarations: [
    ConcursosComponent,
    SummaryComponent,
    VoicesComponent,
    ProfileComponent,
    NewContestComponent
  ],
  exports: [
    ConcursosComponent,
    SummaryComponent,
    VoicesComponent,
    ProfileComponent,
    NewContestComponent
  ],
  imports: [
    BrowserModule,
    DASHBOARD_ROUTES
  ],
  providers: [],
  bootstrap: []
})
export class PagesModule { }