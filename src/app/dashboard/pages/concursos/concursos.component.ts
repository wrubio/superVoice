import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../../services/contest/contest.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-concursos',
  templateUrl: './concursos.component.html',
  styleUrls: ['./concursos.component.css']
})
export class ConcursosComponent implements OnInit {

  contests = [];
  imgContest: string;

  constructor(public contestService: ContestService) {
    this.contestService.getAllContents().subscribe((res: any) => {
      console.log(res);
      this.contests = res;
    });
   }

  ngOnInit() {}

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
}
