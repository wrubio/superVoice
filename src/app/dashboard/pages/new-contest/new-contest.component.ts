import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router  } from '@angular/router';
import { Contest } from '../../../models/contest.model';
import { ContestService } from 'src/app/services/services.index';
import { ok } from 'assert';

@Component({
  selector: 'app-new-contest',
  templateUrl: './new-contest.component.html',
  styleUrls: ['./new-contest.component.css']
})
export class NewContestComponent implements OnInit {

  userId: string;
  uploadImg: File;
  img64;
  constructor(public contestService: ContestService, public router: Router) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userId = user.id;
  }

  ngOnInit() {
  }
  /**
   * Crear nuevo concurso
   * @param form datos del form<NgForm>
   */
  newContest(form: NgForm) {
    if (form.invalid) { return; }
    if (form.value.urlContest.indexOf(' ') >= 0) {
      swal('Importante!', `El nombre de la url no debe tener espacios o caracteres especiales`, 'warning');
      return;
    }
    const contest = new Contest(
      form.value.nameContest,
      form.value.startDateContest,
      form.value.endDateContest,
      form.value.awardContest,
      form.value.guionContest,
      form.value.recomendContest,
      null,
      form.value.urlContest,
      'publicado',
      this.userId
    );
    this.contestService.createContest(contest, this.uploadImg).then( (res: any) => {
      console.log(res);
      if (res.ok === false) {
        if (res.errores.errors[0].type === 'unique violation') {
          swal('Importante!', `El concurso con nombre "${form.value.nameContest}" ya existe, por favor use otro diferente`, 'warning');
        }
      } else {
        swal('Importante!', `El concurso "${form.value.nameContest}" se creo correctamente`, 'success');
        this.router.navigate(['/contest']);
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }
  /**
   * Captura el archivo a subir
   * @param fileToUpload <File> Archivo a subir
   */
  imgSelected(fileToUpload: File) {
    if (!fileToUpload) {
      this.uploadImg = null;
      return;
    }
    this.uploadImg = fileToUpload;
  }
}
