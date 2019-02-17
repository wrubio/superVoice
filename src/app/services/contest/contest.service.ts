import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES, URL_STORAGE } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { resolve, reject } from 'q';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  erorsType = [
    'El nombre del concurso ya existe',
    'La extención debe ser jpg, jpeg, png o gif'
  ];
  constructor(public http: HttpClient, public router: Router) {}

  /**
   * Subir imagenes al servior web
   * @param contest Modelo Contest
   * @param imgFile archivo a subir
   */
  uploadContestImage(contest: Contest, imgFile: File, update: boolean) {

    return new Promise((resl, rejt) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('img', imgFile, imgFile.name);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resl({dataImg: JSON.parse(xhr.response)});
          } else {
            const respError = JSON.parse(xhr.response);
            swal('Importante!', this.erorsType[parseInt(respError.error, 10)], 'warning');
            rejt({dataImg: respError});
          }
        }
      };

      const urlStorage = `${URL_STORAGE}/imageUpload?id=${contest.adminId}&contest=${contest.nombreConcurso}&update=${update}`;
      xhr.open('POST', urlStorage, true);
      xhr.send( formData );
    });
  }
  /**
   * Crear nuevo concuero
   * @param contest Modelo de datos del concuros
   * @param imgFile Archivo tipo file a subir
   */
  async createContest(contest: Contest, imgFile: File) {

    const resUploadImage: any = await this.uploadContestImage(contest, imgFile, false);
    const imgRespPath = resUploadImage.dataImg.path;
    const newImgPath = `${URL_STORAGE}/${imgRespPath.substring(7, imgRespPath.length)}`;
    contest.rutaImagen = newImgPath;
    const url = `${URL_SERVICES}/concurso`;
    const resContest = await this.http.post(url, contest).toPromise();
    return resContest;
  }
  async updateCotest(contest: Contest, imgFile: File, contestId: string) {
    if (imgFile) {
      const resUploadImage: any = await this.uploadContestImage(contest, imgFile, true);
      const imgRespPath = resUploadImage.dataImg.path;
      const newImgPath = `${URL_STORAGE}/${imgRespPath.substring(7, imgRespPath.length)}`;
      contest.rutaImagen = newImgPath;
      const url = `${URL_SERVICES}/concurso/${contestId}`;
      const resContest = await this.http.put(url, contest).toPromise();
      return resContest;
    } else {
      const url = `${URL_SERVICES}/concurso/${contestId}`;
      const resContest = await this.http.put(url, contest).toPromise();
      return resContest;
    }
  }
  /**
   * Traer todos los concursos
   */
  getAllContents() {
    const url = `${URL_SERVICES}/concurso`;
    return this.http.get(url);
  }
  /**
   * Optener concurso por id
   * @param id <string> ID del concurso
   */
  getContestByUserId(id: string) {
    const url = `${URL_SERVICES}/concurso/${id}`;
    return this.http.get(url);
  }
}
