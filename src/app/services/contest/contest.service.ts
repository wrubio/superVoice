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
  uploadContestImage(contest: Contest, imgFile: File, update: boolean, oldNameContest: string) {

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
      const queryPath = `id=${contest.adminId}&contest=${contest.nombreConcurso}&update=${update}&oldName=${oldNameContest}`;
      const urlStorage = `${URL_STORAGE}/imageUpload?${queryPath}`;
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

    const resUploadImage: any = await this.uploadContestImage(contest, imgFile, false, null);
    console.log(resUploadImage);
    const imgRespPath = resUploadImage.dataImg.path;
    const newImgPath = `${URL_STORAGE}/${imgRespPath.substring(7, imgRespPath.length)}`;
    contest.rutaImagen = newImgPath;
    const url = `${URL_SERVICES}/concurso`;
    const resContest = await this.http.post(url, contest).toPromise();
    return resContest;
  }
  /**
   * Actualizar concurso
   * @param contest <Contest> Modelo del concurso
   * @param imgFile <File> Archivo a actualizar
   * @param contestId <string> ID del concurso
   */
  async updateCotest(contest: Contest, imgFile: File, contestId: string, oldNameContest: string) {
    if (imgFile) {
      const resUploadImage: any = await this.uploadContestImage(contest, imgFile, true, oldNameContest);
      const imgRespPath = resUploadImage.dataImg.path;
      const newImgPath = `${URL_STORAGE}/${imgRespPath.substring(7, imgRespPath.length)}`;
      contest.rutaImagen = newImgPath;
      const url = `${URL_SERVICES}/concurso/${contestId}`;
      const resContest = await this.http.put(url, contest).toPromise();
      return resContest;
    } else {
      const queryPath = `id=${contest.adminId}&contest=${contest.nombreConcurso}&update=true&oldName=${oldNameContest}`;
      const urlStorage = `${URL_STORAGE}/imageUpload?${queryPath}`;
      const changeFolder: any = await this.http.post(urlStorage, {data: 'empty'}).toPromise();
      contest.rutaImagen = `${URL_STORAGE}/${changeFolder.newPath}`;
      const url = `${URL_SERVICES}/concurso/${contestId}`;
      const resContest = await this.http.put(url, contest).toPromise();
      console.log(resContest);
      return resContest;
    }
  }
  /**
   * Delete de concursos con sus contenidos
   * @param imageData <string> Nombre de imagen a borrar
   */
  async deleteContest(imageData: any) {
    const urlDeleteImage = `${URL_STORAGE}/imageUpload?id=${imageData.id}&name=${imageData.nameConstest}&userId=${imageData.userId}`;
    await this.http.delete(urlDeleteImage).toPromise();
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
