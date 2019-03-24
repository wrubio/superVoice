import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoicesServices } from 'src/app/services/services.index';

@Component({
  selector: 'app-voices',
  templateUrl: './voices.component.html',
  styleUrls: ['./voices.component.css']
})
export class VoicesComponent implements OnInit, OnDestroy {

  contestVoices = [];
  unsubsContesVoices: any;
  currentId: any;
  audio: any;
  p = 1;

  constructor(public voiceService: VoicesServices) {
    this.currentId = parseInt(localStorage.getItem('id'), 10);
    this.unsubsContesVoices = this.voiceService.getAllVoice().subscribe((resp: any) => {
      resp.map((voice: any) => {
        const urlVoice = voice.rutaArchivoOriginal;
        const sp1UrlVoice = urlVoice.split('contests/');
        const sp2UrlVoice = sp1UrlVoice[1].split('/');
        console.log(parseInt(sp2UrlVoice[0], 10), this.currentId);
        if (parseInt(sp2UrlVoice[0], 10) === this.currentId) {
          this.contestVoices.push(voice);
        }
      });
    });
  }

  ngOnInit() {
    console.log(this.contestVoices);
  }

  /**
   * Desinscribirse de los servicios y promesas
   */
  ngOnDestroy() {
    this.unsubsContesVoices.unsubscribe();
  }

  downloadFile(e: any) {
    const audioId =  parseInt(e.target.dataset.id, 10);
    const audioStatus = e.target.dataset.o;
    this.contestVoices.map((voice: any) => {
      if (voice.id === audioId) {
        this.audio = voice;
      }
    });
    console.log(this.audio);
    const audioUrl = audioStatus === 'convertido' ? this.audio.rutaArchivoConvertida : this.audio.rutaArchivoOriginal;
    const audioExt = audioUrl.split('.').pop();

    const link = document.createElement('a');
    link.href = audioUrl;

    link.setAttribute('download', `audio_${this.audio.url}_${this.audio.nombresLocutor}.${audioExt}`);
    document.getElementsByTagName('body')[0].appendChild(link);
    // Firefox
    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
    } else if (link.click) {
        link.click();
    }
    link.parentNode.removeChild(link);
  }
}
