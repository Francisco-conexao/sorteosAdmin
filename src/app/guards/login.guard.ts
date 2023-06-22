import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate() {
    let user: any = await JSON.parse(localStorage.getItem('SORTEOS'));
    console.log(user);

    if (user != null) {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
