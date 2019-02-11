import { RouterModule, Routes, Router } from '@angular/router';
import { Component } from '@angular/core';

// Components
import { DashboarComponent } from './dashboar.component';
import { ConcursosComponent } from './pages/concursos/concursos.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { VoicesComponent } from './pages/voices/voices.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NewContestComponent } from './pages/new-contest/new-contest.component';
import { EditContestComponent } from './pages/edit-contest/edit-contest.component';


const dashboardRoutes: Routes = [
    { path: '',
        component:  DashboarComponent,
        children: [
            { path: 'summary', component:  SummaryComponent},
            { path: 'contest', component: ConcursosComponent},
            { path: 'newContest', component: NewContestComponent},
            { path: 'editContest/:id', component: EditContestComponent, pathMatch: 'full'},
            { path: 'voices', component:  VoicesComponent},
            { path: 'profile', component:  ProfileComponent},
            { path: '', redirectTo: '/summary', pathMatch: 'full' }
        ]
    }
];

export const DASHBOARD_ROUTES = RouterModule.forChild(dashboardRoutes);
