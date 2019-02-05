import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule { }
