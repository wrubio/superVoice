import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
    UserService,
    LoginGuardGuard
} from './services.index';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        UserService,
        LoginGuardGuard
    ],
    declarations: []
})

export class ServiceModule {}