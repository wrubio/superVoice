import { Component, OnInit, ViewChild, AfterViewChecked  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestService } from 'src/app/services/services.index';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { Contest } from 'src/app/models/contest.model';

@Component({
  selector: 'app-edit-contest',
  templateUrl: './edit-contest.component.html',
  styleUrls: ['./edit-contest.component.css']
})
export class EditContestComponent implements OnInit, AfterViewChecked {

  @ViewChild('f') f: NgForm;

  contest: any;
  idContest: string;
  setDateStart: string;
  setDateEnd: string;
  uploadImg: File;
  forma: FormGroup;
  pathImg: string;

  constructor(public contestService: ContestService, private route: ActivatedRoute, public router: Router) {
    this.idContest = this.route.snapshot.paramMap.get('id');
    this.contestService.getContestByUserId(this.idContest).subscribe((res: any) => {
      this.contest =  res;
      const dateStart = new Date(res.fechaInicio);
      const dateEnd = new Date(res.fechaFin);
      this.setDateStart = dateStart.toISOString().slice(0, 10);
      this.setDateEnd = dateEnd.toISOString().slice(0, 10);
      this.pathImg = res.rutaImagen;
      this.initialValues();
    });
  }

  ngOnInit() {
    this.forma = new FormGroup({
      nameContest: new FormControl(null),
      startDateContest: new FormControl(null),
      endDateContest: new FormControl(null),
      awardContest: new FormControl(null),
      guionContest: new FormControl(null),
      recomendContest: new FormControl(null),
      urlContest: new FormControl(null),
    });
  }

  editContest() {
    if (this.forma.invalid) { return; }
    if (this.forma.value.urlContest.indexOf(' ') >= 0) {
      swal('Importante!', `El nombre de la url no debe tener espacios o caracteres especiales`, 'warning');
      return;
    }
    const contest = new Contest(
      this.forma.value.nameContest,
      this.forma.value.startDateContest,
      this.forma.value.endDateContest,
      this.forma.value.awardContest,
      this.forma.value.guionContest,
      this.forma.value.recomendContest,
      this.pathImg,
      this.forma.value.urlContest,
      'publicado',
      this.contest.administradorId
    );

    const startDate = new Date(this.forma.value.startDateContest);
    const endDate = new Date(this.forma.value.endDateContest);

    // Validacion de la fechas de inicio y finalizacion
    if (endDate.getTime() < startDate.getTime()) {
      swal('Importante!', `La fecha final no debe estar antes que la inicial`, 'warning');
      return;
    }

    this.contestService.updateCotest(contest, this.uploadImg, this.idContest).then( (res: any) => {
      swal('Importante!', `El concurso "${this.forma.value.nameContest}" se actualizó correctamente`, 'success');
      this.router.navigate(['/contest']);
    }).catch((err: any) => {
      if (err.error.errors.nombreURL.message === 'the nombreURL must be unique') {
        swal('Importante!', `El concurso con nombre "${this.forma.value.urlContest}" ya existe, por favor use otro diferente`, 'warning');
      } else {
        swal('Ups!', `El concurso "${this.forma.value.nameContest}" no se pudo actualizar`, 'warning');
      }
    });
  }
  /**
   * Captura el archivo a subir
   * @param fileToUpload <File> Archivo a subir
   */
  imgSelected(fileToUpload: File, input: any) {
    if (!fileToUpload) {
      this.uploadImg = null;
      return;
    }
    this.uploadImg = fileToUpload;
    const nameFile = this.uploadImg.name;
    const fileExt = nameFile.split('.').pop();
    // type of image
    const typeImg = ['jpg', 'jpeg', 'png', 'gif'];
    if (typeImg.indexOf(fileExt.toLowerCase()) < 0) {
      swal('Importante!', `Solo se permitien formatos de imagenes ${typeImg.join(', ')}`, 'warning');
      this.uploadImg = null;
      input.value = '';
      return;
    }
  }
  /**
   * Asigna los valores guardados del concurso
   */
  initialValues() {
    this.forma = new FormGroup({
      nameContest: new FormControl(this.contest.nombreConcurso),
      startDateContest: new FormControl(this.setDateStart),
      endDateContest: new FormControl(this.setDateEnd),
      awardContest: new FormControl(parseInt(this.contest.valorPagar, 10)),
      guionContest: new FormControl(this.contest.guion),
      recomendContest: new FormControl(this.contest.recomendaciones),
      urlContest: new FormControl(this.contest.nombreURL),
    });
  }
  ngAfterViewChecked() {}
}
