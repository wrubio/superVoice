import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContestService } from '../../../services/contest/contest.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { InvitationService, VoicesServices } from 'src/app/services/services.index';
import { analyzeAndValidateNgModules } from '@angular/compiler';
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
  mailService: any;
  ctrMail = 0;
  voiceSub: any;
  voiceOfContest: any;
  cContest: any;
  p = 1;
  currentId: any;

  constructor(
    public contestService: ContestService,
    public router: Router, public invService: InvitationService,
    public voiceService: VoicesServices ) {
      this.currentId = parseInt(localStorage.getItem('id'), 10);
      this.services = this.contestService.getAllContents().subscribe((res: any) => {
        this.contests = res.filter((contest: any) => contest.administradorId === this.currentId);
        // this.contests = res;
        console.log(this.contests);
      });
      this.voiceSub = this.voiceService.getAllVoice().subscribe((v: any) => {
        this.voiceOfContest = v;
      });
   }

  ngOnInit() {}
  /**
   * Borrar concurso
   * @param e <$event>
   */
  deleteEvent(e: any) {
    const idContest = parseInt(e.target.dataset.idContest, 10);
    const urlContest = e.target.dataset.url;
    console.log(urlContest);
    let nameContest: string;
    let idUser: string;
    let oldNameContest: string;
    this.contests.map((conts: any) => {
      if (conts.id === idContest) {
        this.cContest = conts;
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
          // console.log(res);
          const configVoices = async () => {
            for (const voice of this.voiceOfContest) {
              if (voice.url === urlContest) {
                const algo = await this.voiceService.deleteVoice(voice.id);
                console.log(algo);
              }
            }
          };
          configVoices().then((del: any) => {
            this.reloadPage();
          });
        }).catch((err: any) => {
          // console.log(err);
        });
      } else {
        // console.log(willDelete);
      }
    });
  }
  /**
   * Muestra la modal del banner del concurso o de la voz ganadora
   * @param e <$event> HTML target element
   */
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
  /**
   * Invita a locutores a ver la pagina del concurso (emails)
   * @param forma <string>
   */
  sendInivtations(forma: NgForm) {
    if (forma.invalid) { return; }
    let getMails = forma.value.mails;
    const myRe = /^[a-zA-Z0-9.\ \@\,\_\-]*$/g;
    const myArray = myRe.exec(getMails);
    if (myArray !== null) {
      if (getMails.indexOf(' ') >= 0) {
        getMails = getMails.replace(/\s/g, '');
      }
    }
    const splitGetEmail = getMails.split(',');
    const lnSplitGetEmail = splitGetEmail.length;
    const emails: any = [];
    let i = 0;
    for (i; i < lnSplitGetEmail; i++) {
      emails.push(splitGetEmail[i]);
    }
    this.mailService = this.invService.sendInvitations(emails).subscribe((res: any) => {
      console.log(res);
      if (res.ok === true ) {
        $('#mail-modal').modal('hide');
        this.ctrMail = 1;
      }
    });
  }
  /**
   * Modal para agregar los correos a enviar
   * @param e <string>
   */
  sendMail(e: any) {
    const urlContest = `${window.location.href}/${e}`;
    $('#mail-modal').modal('show');
  }
  /**
   * Captura url del concurso para crear link
   * @param e <string>
   */
  externalLink(e: any) {
    const newLink = `${window.location.href}/${e}`;
    window.open(newLink);
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
    if (this.ctrMail === 1) {
      this.mailService.unsubscribe();
    }
  }
}
