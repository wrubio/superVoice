import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Web Page components
import { WebPageComponent } from './web-page.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    WebPageComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: []
})
export class WebPageModule { }
