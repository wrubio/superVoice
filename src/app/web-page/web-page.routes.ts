import { RouterModule, Routes, Router } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { WebPageComponent } from './web-page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const webpRoutes: Routes = [
    { path: '',
        component:  WebPageComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'login', component: LoginComponent},
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: '/home', pathMatch: 'full' }
        ]
    }
];

export const WEBP_ROUTES = RouterModule.forChild(webpRoutes);