import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    user:any = {};
    constructor(private router: Router) { }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('MUBOCHI'));
    }

    salir(){
        localStorage.removeItem('MUBOCHI');
        this.router.navigateByUrl('login');
    }
}
