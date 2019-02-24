import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/services.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}