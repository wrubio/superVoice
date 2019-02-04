import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Dashboar modules
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Components
import { DashboarComponent } from './dashboar.component';

@NgModule({
  declarations: [
    DashboarComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    SharedModule
  ],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
