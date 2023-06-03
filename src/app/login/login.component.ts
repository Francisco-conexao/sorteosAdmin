import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    //SERVICES---------------------
    private loginServ: LoginService
  ) {}

  ngOnInit(): void {
    console.log('login');
  }

  async login(form) {
    if (form.valid) {
      this.spinner.show();
      this.loginServ.login(this.user).then((data) => {
        this.spinner.hide();
        let datos: any = data;
        if (datos.status == 200) {
          localStorage.setItem('MUBOCHI', JSON.stringify(datos.user));
          this.router.navigateByUrl('/app');
        } else if (datos.status == 300) {
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Oops...',
          //     text: 'Los datos introducidos son incorrectos. Inténtelo de nuevo.',
          //   });
        } else if (datos.status == 400) {
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Oops...',
          //     text: 'No podemos encontrar una cuenta con esta dirección de email.',
          //   });
        }
      });
    } else {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'Es necesario llenar todos los campos',
      //   });
    }
  }
}
