import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(public http: HttpClient, public router: Router) {
    console.log('servicio constest listo para usar');
  }

  createContest(contest: Contest) {
    const url = `${URL_SERVICES}/concurso`;
    return this.http.post(url, contest);
  }
}
