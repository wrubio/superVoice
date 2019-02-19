import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES, URL_STORAGE } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  constructor(public http: HttpClient, public router: Router) {}
  sendInvitations(emails: any) {
    const url = `${URL_STORAGE}/invitation`;
    return this.http.post(url, emails).pipe(map( (resp: any) => {
        if (resp.ok === true) {
            swal('Super: ', 'Los correos han sido enviados', 'success');
        } else {
            swal('Lo sentimos: ', 'Los correos no se pudieron enviar, intente de nuevo o más tarde', 'warning');
        }
        return resp;
    }));
  }
}
