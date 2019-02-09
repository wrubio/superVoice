import { Component, OnInit, HostListener, ViewChild, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

@HostListener('window:scroll', ['$event'])

export class HomeComponent implements OnInit {
  @ViewChild('homeVideoHeader') homeVideoHeader: ElementRef;
  constructor() { }

  ngOnInit() {
    this.homeVideoHeader.nativeElement.autoplay = true;
  }

  scrollEvent($event: Event) {
    const scrollTopVal = $event.srcElement.children[0].scrollTop;
    const navBar = document.querySelector('.pg-navbar');
    scrollTopVal >= 650 ? navBar.classList.add('pg-navbar-bg') : navBar.classList.remove('pg-navbar-bg');
  }
}
