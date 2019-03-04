import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/services.index';
import { User } from '../../models/user.model';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public userService: UserService, public router: Router ) {}

  ngOnInit() {
  }

  userLogin(form: NgForm) {
    if (form.invalid) { return; }
    const user = new User(
      null,
      null,
      form.value.username,
      null,
      form.value.password
    );
    this.userService.userLogin(user).subscribe( (res: any) => {
      if (res.ok === true) {
        this.router.navigate(['/summary']);
      }
    });
  }
}
