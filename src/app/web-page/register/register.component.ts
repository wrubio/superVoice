import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/services.index';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(public userService: UserService, public router: Router) { }

  areSamePassword(val1: string, val2: string) {
    return ( group: FormGroup ) => {
      const pass1 = group.controls[val1].value;
      const pass2 = group.controls[val2].value;
      if (pass1 === pass2) { return null; }
      return { areSame: true };
    };
  }

  ngOnInit() {
    this.forma = new FormGroup({
      nombres: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      nombreEmpresa: new FormControl(null, Validators.required),
      contrasena: new FormControl(null, Validators.required),
      rContrasena: new FormControl(null, Validators.required),
      condiciones: new FormControl(false),
    }, { validators: this.areSamePassword('contrasena', 'rContrasena') });
  }

  userRegister() {
    if (this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
      swal('Importante!', 'Debe haceptar las codiciones', 'warning');
      return;
    }

    const user = new User(
      this.forma.value.nombres,
      this.forma.value.apellidos,
      this.forma.value.correo,
      this.forma.value.nombreEmpresa,
      this.forma.value.contrasena
    );

    this.userService.newUser(user).subscribe( (res: any) => {
      if (res.ok === true ) {
        this.router.navigate(['/login']);
      }
    });
  }
}
