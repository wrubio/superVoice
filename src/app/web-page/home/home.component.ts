import { Component, OnInit, HostListener  } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@HostListener('window:scroll', ['$event'])

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollEvent($event: Event) {
    const scrollTopVal = $event.srcElement.children[0].scrollTop;
    const navBar = document.querySelector('.pg-navbar');
    scrollTopVal >= 650 ? navBar.classList.add('pg-navbar-bg') : navBar.classList.remove('pg-navbar-bg');
  }
}
