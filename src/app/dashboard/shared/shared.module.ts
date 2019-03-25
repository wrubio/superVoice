import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DASHBOARD_ROUTES } from '../dashboard.routes';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    DASHBOARD_ROUTES
  ],
  exports: [
    NavbarComponent,
    SidebarComponent
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
