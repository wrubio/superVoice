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
        const queryPath = `contestId=${contestData.contestId}&userId=${contestData.userId}&voice=${JSON.stringify(voice)}`;
        const urlStorage = `${URL_SERVICES}/registro?${queryPath}`;
        xhr.open('POST', urlStorage, true);
        xhr.send( formData );
      });
  }

  /**
   * Crear una voz de un concurso
   * @param { Object }, voice
   * @param { File }, audio
   * @param { String }, contestData
   */
  async createVoice(voice: Voice, audio: File, contestData: any) {
    const uploadAudioRes: any = await this.uploadVoice(audio, contestData, voice);
    return uploadAudioRes;
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
