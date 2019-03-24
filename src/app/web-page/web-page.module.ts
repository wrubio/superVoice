import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import {NgxPaginationModule} from 'ngx-pagination';

// Web Page components
import { WebPageComponent } from './web-page.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WpContestComponent } from './wp-contest/wp-contest.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Routes
import { WEBP_ROUTES } from './web-page.routes';

@NgModule({
  declarations: [
    WebPageComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    WpContestComponent
  ],
  imports: [
    BrowserModule,
    WEBP_ROUTES,
    ReactiveFormsModule,
    FormsModule,
    NgxLoadingModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: []
})
export class WebPageModule { }
