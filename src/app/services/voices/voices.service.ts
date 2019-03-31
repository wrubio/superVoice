import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES, URL_STORAGE } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Voice } from '../../models/voices.model';

@Injectable({
  providedIn: 'root'
})
export class VoicesServices {

  constructor(public http: HttpClient, public router: Router) {
  }

  uploadVoice(audio: File, contestData: any, voice: Voice) {
      return new Promise((rsl, rjt) => {
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('audio', audio, audio.name);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                rsl({dataImg: JSON.parse(xhr.response)});
            } else {
              const respError = JSON.parse(xhr.response);
              swal('Importante!', respError.message, 'warning');
              rjt({dataImg: respError});
            }
          }
        };
        const queryPath = `contestId=${contestData.contestId}&userId=${contestData.userId}&voice=${voice}`;
        const urlStorage = `${URL_SERVICES}/registro?${queryPath}`;
        xhr.open('POST', urlStorage, true);
        xhr.send( formData );
      });
  }
  async createVoice(voice: Voice, audio: File, contestData: any) {
    const uploadAudioRes: any = await this.uploadVoice(audio, contestData, voice);
    console.log(uploadAudioRes);
    /*
    const audioRespPath = uploadAudioRes.dataImg.path;
    const newAudioPath: any = `${URL_STORAGE}/${audioRespPath.substring(7, audioRespPath.length)}`;
    voice.rutaArchivoOriginal = newAudioPath;
    const url = `${URL_SERVICES}/registro`;
    const resContest = await this.http.post(url, voice).toPromise();
    return resContest;
    */
  }

  getAllVoice() {
    const url = `${URL_SERVICES}/registro`;
    return this.http.get(url);
  }

  deleteVoice(id: any) {
    const url = `${URL_SERVICES}/registro/${id}`;
    console.log(url);
    return this.http.delete(url).toPromise();
  }
}
