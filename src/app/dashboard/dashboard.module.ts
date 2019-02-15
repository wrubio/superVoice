import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Dashboar modules
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Components
import { DashboarComponent } from './dashboar.component';


// Routes
import { DASHBOARD_ROUTES } from './dashboard.routes';

@NgModule({
  declarations: [
    DashboarComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    SharedModule,
    DASHBOARD_ROUTES
  ],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
