import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
// Components
import { ConcursosComponent } from './concursos/concursos.component';
import { SummaryComponent } from './summary/summary.component';
import { VoicesComponent } from './voices/voices.component';
import { ProfileComponent } from './profile/profile.component';
import { NewContestComponent } from './new-contest/new-contest.component';
import { DASHBOARD_ROUTES } from '../dashboard.routes';
import { EditContestComponent } from './edit-contest/edit-contest.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VoiceContestComponent } from './voice-contest/voice-contest.component';

@NgModule({
  declarations: [
    ConcursosComponent,
    SummaryComponent,
    VoicesComponent,
    ProfileComponent,
    NewContestComponent,
    EditContestComponent,
    VoiceContestComponent
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
    DASHBOARD_ROUTES,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: []
})
export class PagesModule { }
