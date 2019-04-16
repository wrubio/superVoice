import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService, VoicesServices } from 'src/app/services/services.index';
import { NgForm } from '@angular/forms';
import { Voice } from '../../models/voices.model';

@Component({
  selector: 'app-wp-contest',
  templateUrl: './wp-contest.component.html',
  styleUrls: ['./wp-contest.component.css']
})
export class WpContestComponent implements OnInit, OnDestroy {

  urlContest: string;
  contest = {
    administradorId: '',
    estadoPublicacion: '',
    fechaFin: '',
    fechaInicio: '',
    guion: '',
    nombreConcurso: '',
    nombreURL: '',
    recomendaciones: '',
    rutaImagen: '',
    valorPagar: '',
    _id: '',
  };
  contestVoices = [];
  uploadAudio: File;
  public loading = true;
  subsContest: any;
  subsVoices: any;
  p = 1;
  showLoader = false;

  constructor(
    public contestService: ContestService,
    private route: ActivatedRoute,
    public router: Router,
    public voicesServices: VoicesServices) {
    this.urlContest = this.route.snapshot.paramMap.get('id');
    this.subsContest = this.contestService.getAllContents().subscribe((res: any) => {
      let cntContest = 0;
      res.map((cnts: any) => {
        if (cnts.nombreURL === this.urlContest) {
          this.contest = cnts;
          cntContest = 1;
        }
      });
      if (cntContest === 0) {
        this.router.navigate(['/error404']);
      }
      this.subsVoices = this.voicesServices.getAllVoice().subscribe((resp: any) => {
        console.log(resp);
        resp.voices.map((voice: any) => {
          console.log(this.contest._id, voice._id);
          if (this.contest._id === voice.contestId) {
            this.contestVoices.push(voice);
          }
        });
      });
    });
  }

  ngOnInit() {
    this.loading = false;
  }
  /**
   * Crear nuevo superVoice
   * @param form datos del form<NgForm>
   */
  newVoices(forma: NgForm) {
    if (forma.invalid) { return; }
    if (forma.value.conditions !== true) {
      swal('Importante!', `Debe aceptar las condiciones de uso.`, 'warning');
      return;
    }
    this.showLoader = true;
    const voice = new Voice(
      null,
      null,
      'original',
      forma.value.nombresLocutor,
      forma.value.apellidosLocutor,
      forma.value.correoLocutor,
      forma.value.observacionesLocutor,
      forma.value.conditions,
      this.contest.nombreURL,
      0,
      this.contest._id
    );
    const contestInfo = { contestId: this.contest._id, userId: this.contest.administradorId, contestName: this.contest.nombreConcurso };
    this.voicesServices.createVoice(voice, this.uploadAudio, contestInfo).then((res: any) => {
      swal('Hola!', `Hemos recibido tu voz y la estamos procesando para que sea
      publicada en la página del concurso y pueda ser posteriormente revisada por nuestro equipo de trabajo.
      Tan pronto la voz quede publicada en la página del concurso, te notificaremos por email`, 'success');
      this.showLoader = false;
      this.reloadPage();
    }).catch((err: any) => {
      console.log(err);
    });
  }
  /**
   * Captura el archivo a subir
   * @param fileToUpload <File> Archivo a subir
   */
  audioSelected(fileToUpload: File, input: any) {
    if (!fileToUpload) {
      this.uploadAudio = null;
      return;
    }
    const nameFile = fileToUpload.name;
    const fileExt = nameFile.split('.').pop();
    // type of image
    const typeVoice = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
    if (typeVoice.indexOf(fileExt.toLowerCase()) < 0) {
      swal('Importante!', `Solo se permitien formatos de imagenes ${typeVoice.join(', ')}`, 'warning');
      this.uploadAudio = null;
      input.value = '';
      return;
    }
    this.uploadAudio = fileToUpload;
  }
  /**
   * Evento para mostrar el navbar despues del header
   * @param $event <htmlElement>
   */
  scrollEvent($event: Event) {
    const scrollTopVal = $event.srcElement.children[0].scrollTop;
    const navBar = document.querySelector('.pg-navbar');
    scrollTopVal >= 650 ? navBar.classList.add('pg-navbar-bg') : navBar.classList.remove('pg-navbar-bg');
  }
  /**
   * Recarga nuevamente el componente
   */
  reloadPage() {
    this.router.navigateByUrl('home', {skipLocationChange: true}).then( () => this.router.navigate([`contest/${this.urlContest}`]));
  }

  /**
   * Desinscribirse de los servicios y promesas
   */
  ngOnDestroy() {
    this.subsContest.unsubscribe();
  }
}
