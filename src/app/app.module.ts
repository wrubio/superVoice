import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Web page modules
import { WebPageModule } from './web-page/web-page.module';

// Dashboard modules
import { DashboardModule } from './dashboard/dashboard.module';
import { Page404Component } from './page404/page404.component';

// Routes
import { APP_ROUTES } from './app.routes';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';
import { WEBP_ROUTES } from './web-page/web-page.routes';

// Services
import { ServiceModule } from './services/services.module';


@NgModule({
  declarations: [
    AppComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    WebPageModule,
    DashboardModule,
    ServiceModule,
    APP_ROUTES,
    DASHBOARD_ROUTES,
    WEBP_ROUTES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
