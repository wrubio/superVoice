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

  constructor(public http: HttpClient, public router: Router) {
    this.loadStorage();
  }

  token: string;

  isSignIn() {
    return (this.token.length > 10 ? true : false);
  }

  loadStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    } else {
      this.token = '';
    }
  }

  userLogin(data: any) {
    const url = URL_SERVICES + '/login';
    return this.http.post(url, data)
      .pipe(map( (resp: any) => {
        if (resp.ok === false) {
          swal('Importante: ', 'Las credenciales ingresadas no son correctas', 'warning');
          return { ok: resp.ok };
        }
        const userId = resp.user._id;
        this.token = resp.token;
        localStorage.setItem('id', userId);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));
        this.isSignIn();
        return { ok: true };
      }));
  }

  userLogOut() {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  newUser(user: User) {
    const url = URL_SERVICES + '/administrador';
    return this.http.post(url, user)
      .pipe(map( (resp: any) => {
        if (resp.ok === false) {
          swal('Importante: ', user.correo + ' ya existe, ingrese otro correo.', 'warning');
          return { ok: resp.ok };
        }
        swal('Usuario: ', user.nombres + ' Fue crado!', 'success');
        return { ok: true };
      }));
  }
}
