import { RouterModule, Routes, Router } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { DashboarComponent } from './dashboar.component';
import { ConcursosComponent } from './pages/concursos/concursos.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { VoicesComponent } from './pages/voices/voices.component';
import { ProfileComponent } from './pages/profile/profile.component';

// Components


const dashboardRoutes: Routes = [
    { path: 'dashboard',
        component:  DashboarComponent,
        children: [
            { path: '', component:  SummaryComponent},
            { path: 'contest', component: ConcursosComponent},
            { path: 'voices', component:  VoicesComponent},
            { path: 'profile', component:  ProfileComponent},
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    }
];

export const DASHBOARD_ROUTES = RouterModule.forChild(dashboardRoutes);
