import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// Dashboar modules
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Components
import { DashboarComponent } from './dashboar.component';


// Routes
import { DASHBOARD_ROUTES } from './dashboard.routes';
import { WEBP_ROUTES } from '../web-page/web-page.routes';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    DashboarComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    SharedModule,
    DASHBOARD_ROUTES,
    WEBP_ROUTES,
    PipesModule
  ],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
