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
    const sidebar = document.querySelector('.sidebar');
    this.smShowMenu === false ? sidebar.classList.add('sidebar-sm-show') : sidebar.classList.remove('sidebar-sm-show');
    this.smShowMenu = !this.smShowMenu;
  }
}
