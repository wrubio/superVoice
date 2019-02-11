import { RouterModule, Routes, Router } from '@angular/router';

import { Page404Component } from './page404/page404.component';


const appRoutes: Routes = [
    { path: '**', component: Page404Component }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });
