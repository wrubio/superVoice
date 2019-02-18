import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService, VoicesServices } from 'src/app/services/services.index';
import { NgForm } from '@angular/forms';
import { Voice } from '../../models/voices.model';

@Component({
  selector: 'app-wp-contest',
  templateUrl: './wp-contest.component.html',
  styleUrls: ['./wp-contest.component.css']
})
export class WpContestComponent implements OnInit {

  urlContest: string;
  contest: any;
  uploadAudio: File;
  public loading = true;

  constructor(
    public contestService: ContestService,
    private route: ActivatedRoute,
    public router: Router,
    public voicesServices: VoicesServices) {
    this.urlContest = this.route.snapshot.paramMap.get('id');
    this.contestService.getAllContents().subscribe((res: any) => {
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
      console.log(this.contest);
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
    const voice = new Voice(
      forma.value.rutaArchivoOriginal,
      forma.value.rutaArchivoConvertida,
      forma.value.estadoRegistroVoces,
      forma.value.nombresLocutor,
      forma.value.apellidosLocutor,
      forma.value.correoLocutor,
      forma.value.observacionesLocutor
    );
  }
  /**
   * Captura el archivo a subir
   * @param fileToUpload <File> Archivo a subir
   */
  audioSelected(fileToUpload: File) {
    if (!fileToUpload) {
      this.uploadAudio = null;
      return;
    }
    console.log(fileToUpload);
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
}
