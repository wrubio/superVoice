import { RouterModule, Routes, Router } from '@angular/router';
import { Component } from '@angular/core';
import { DashboarComponent } from './dashboar.component';

// Components


const webpRoutes: Routes = [
    { path: '',
        component:  DashboarComponent,
        children: [
            { path: 'dashboard', component: HomeComponent },
            { path: 'concursos', component: LoginComponent},
            { path: 'voices', component: RegisterComponent },
            { path: 'profile', component: RegisterComponent },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];

export const WEBP_ROUTES = RouterModule.forChild(webpRoutes);
