import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContestService } from '../../../services/contest/contest.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-concursos',
  templateUrl: './concursos.component.html',
  styleUrls: ['./concursos.component.css']
})
export class ConcursosComponent implements OnInit, OnDestroy {

  contests = [];
  imgContest: string;
  services: any;

  constructor(public contestService: ContestService, public router: Router) {
    this.services = this.contestService.getAllContents().subscribe((res: any) => {
      this.contests = res;
    });
   }

  ngOnInit() {}

  deleteEvent(e: any) {
    const idContest = parseInt(e.target.dataset.idContest, 10);
    let nameContest: string;
    let idUser: string;
    let oldNameContest: string;
    this.contests.map((conts: any) => {
      if (conts.id === idContest) {
        oldNameContest = conts.nombreConcurso;
        const splitName = conts.nombreConcurso.split(' ');
        const lengthSplitName = splitName.length;
        let i = 0;
        let newContestName = '';
        for (i; i < lengthSplitName; i++) {
            newContestName += splitName[i];
        }
        nameContest = newContestName;
        idUser = conts.administradorId;
      }
    });
    const dataImage = {id: idContest, nameConstest: nameContest, userId: idUser};
    swal({
      title: '¿Borrar el concurso?',
      text: `Una vez borrado, el concurso "${oldNameContest}" ya no estará disponible!`,
      icon: 'warning',
      buttons: ['Cancelar', 'Borrar concurso'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        this.contestService.deleteContest(dataImage).then((res: any) => {
          console.log(res);
          this.reloadPage();
        }).catch((err: any) => {
          console.log(err);
        });
      } else {
        console.log(willDelete);
      }
    });
  }

  showModal(e: any) {
    const modalId = e.target.dataset.voice;
    const idContest = parseInt(e.target.dataset.idContest, 10);
    this.contests.map((cts: any) => {
      if (cts.id === idContest) {
        this.imgContest = cts.rutaImagen;
      }
    });
    $('#' + modalId).modal('show');
  }
  // ===============================================================================
  // Recarga nuevamente el componente
  reloadPage() {
    this.router.navigateByUrl('summary', {skipLocationChange: true}).then( () => this.router.navigate(['contest']));
  }
  // ===============================================================================
  // Desinscribirse de los servicios y promesas
  ngOnDestroy() {
    this.services.unsubscribe();
  }
}
