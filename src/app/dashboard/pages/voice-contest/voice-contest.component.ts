import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoicesServices } from 'src/app/services/services.index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-voice-contest',
  templateUrl: './voice-contest.component.html',
  styleUrls: ['./voice-contest.component.css']
})
export class VoiceContestComponent implements OnInit, OnDestroy {

  contestVoices = [];
  unsubsContesVoices: any;
  audio: any;
  urlContest: any;
  p = 1;

  constructor(
    public voiceService: VoicesServices,
    public route: ActivatedRoute,
    public router: Router) {
    this.urlContest = this.route.snapshot.paramMap.get('id');
    this.unsubsContesVoices = this.voiceService.getAllVoice().subscribe((resp: any) => {
      console.log(resp);
      resp.map((a: any) => {
        if (a.url === this.urlContest) {
          this.contestVoices.push(a);
        }
      });
    });
  }

  ngOnInit() {
  }

  /**
   * Desinscribirse de los servicios y promesas
   */
  ngOnDestroy() {
    this.unsubsContesVoices.unsubscribe();
  }

  downloadFile(e: any) {
    const audioId =  e.target.dataset.id;
    const audioStatus = e.target.dataset.o;
    this.contestVoices.map((voice: any) => {
      if (voice.id === audioId) {
        this.audio = voice;
      }
    });
    // console.log(this.audio);
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
