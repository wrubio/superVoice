import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) {
    console.log('servicio user listo');
  }

  getUser(data: any) {
    const url = URL_SERVICES + '/login';
    return this.http.post(url, data);
  }

  newUser(user: User) {
    const url = URL_SERVICES + '/administrador';
    return this.http.post(url, user)
      .pipe(map( (resp: any) => {
        if (resp.ok === false) {
          swal('Importante: ', user.correo + ' ya existe, ingrese otro correo.', 'warning');
          return { ok: resp.ok };
        } else {
          swal('Usuario: ', user.nombres + ' Fue crado!', 'success');
          return { ok: true };
        }
      }));
  }
}
