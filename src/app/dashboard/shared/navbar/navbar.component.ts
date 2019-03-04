import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  smShowMenu = false;

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  showMenu(e) {
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    this.smShowMenu === false ? sidebar.classList.add('sidebar-sm-show') : sidebar.classList.remove('sidebar-sm-show');
    this.smShowMenu === false ? navbar.classList.add('navbar-move-left') : navbar.classList.remove('navbar-move-left');
    this.smShowMenu = !this.smShowMenu;
  }
}
