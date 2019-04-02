import { Injectable } from '@angular/core';
import { Contest } from '../../models/contest.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES, URL_STORAGE } from '../../config/config';
import { map, repeat } from 'rxjs/operators';
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
  uploadContestImage(contest: any, imgFile: File, update: boolean, contestId: string) {

    return new Promise((resl, rejt) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('img', imgFile, imgFile.name);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201) {
            resl({dataImg: JSON.parse(xhr.response)});
          } else {
            const respError = JSON.parse(xhr.response);
            swal('Importante!', this.erorsType[parseInt(respError.error, 10)], 'warning');
            rejt({dataImg: respError});
          }
        }
      };

      let queryPath: any;

      if (update) {
        queryPath = `id=${contest.adminId}&contest=${contestId}&update=${update}`;
      } else {
        queryPath = `id=${contest.administradorId}&contest=${contest._id}&update=${update}`;
      }

      const urlStorage = `${URL_SERVICES}/imageUpload?${queryPath}`; // `${URL_STORAGE}/imageUpload?${queryPath}`;
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
    const url = `${URL_SERVICES}/concurso`;
    const resContest: any = await this.http.post(url, contest).toPromise();
    const resUploadImage: any = await this.uploadContestImage(resContest.contest, imgFile, false, null);
    return resUploadImage;
  }
  /**
   * Actualizar concurso
   * @param contest <Contest> Modelo del concurso
   * @param imgFile <File> Archivo a actualizar
   * @param contestId <string> ID del concurso
   */
  async updateCotest(contest: Contest, imgFile: File, contestId: string) {
    console.log(imgFile);
    if (imgFile) {
      const resUploadImage: any = await this.uploadContestImage(contest, imgFile, true, contestId);
      const newImgPath = resUploadImage.dataImg.data;
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
   * Delete de concursos con sus contenidos
   * @param imageData <string> Nombre de imagen a borrar
   */
  async deleteContest(imageData: any) {
    const url = `${URL_SERVICES}/concurso/${imageData.id}`;
    return await this.http.delete(url).toPromise();
    // return deleteImage;
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
