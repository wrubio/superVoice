import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-web-page',
  templateUrl: './web-page.component.html',
  styleUrls: ['./web-page.component.css']
})
export class WebPageComponent implements OnInit {

  hideShared = false;

  constructor(private route: Router) {
    this.route.events.subscribe( (val: any) => {
      this.route.url === '/login' || this.route.url === '/register' ? this.hideShared = true : this.hideShared = false;
    });
   }

  ngOnInit() {
  }

}
