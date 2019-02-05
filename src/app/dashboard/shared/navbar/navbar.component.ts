import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  smShowMenu = false;

  constructor() { }

  ngOnInit() {
  }

  showMenu(e) {
    console.log('click');
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    this.smShowMenu === false ? sidebar.classList.add('sidebar-sm-show') : sidebar.classList.remove('sidebar-sm-show');
    this.smShowMenu === false ? navbar.classList.add('navbar-move-left') : navbar.classList.remove('navbar-move-left');
    this.smShowMenu = !this.smShowMenu;
  }
}
