import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Web Page components
import { WebPageComponent } from './web-page.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';

// Routes
import { WEBP_ROUTES } from './web-page.routes';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    WebPageComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    WEBP_ROUTES
  ],
  providers: [],
  bootstrap: []
})
export class WebPageModule { }
