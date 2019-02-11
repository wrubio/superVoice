import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-concursos',
  templateUrl: './concursos.component.html',
  styleUrls: ['./concursos.component.css']
})
export class ConcursosComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  showModal(e: any) {
    const modalId = e.target.dataset.voice;
    console.log(modalId);
    $('#' + modalId).modal('show');
  }
}
