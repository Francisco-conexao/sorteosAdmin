import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { DomSanitizer } from '@angular/platform-browser';

import { BoletosService } from '../services/boletos.service';
import { SorteosService } from '../services/sorteos.service';
import { PagosService } from '../services/pagos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  clientes: any = [];
  clientes2: any = [];

  buscar: string;

  clienteSelect: any = {};

  boletos: any = [];

  cupon: any = {};
  cupones: any = [];

  sorteo: any = {};
  sorteos: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    //SERVICES-----------------------------
    private boletosServ: BoletosService,
    private sorteosServ: SorteosService,
    private pagosServ: PagosService
  ) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes() {
    this.spinner.show();
    this.boletosServ.listarPedido().then((data: any) => {
      this.spinner.hide();
      if (data.clientes != null) {
        this.clientes = data.clientes;
        this.clientes2 = data.clientes;
      } else {
        this.clientes = [];
        this.clientes2 = [];
      }
    });
  }

  getItems(ev: any) {
    this.clientes = this.clientes2;
    if (ev && ev.trim() != '') {
      this.clientes = this.clientes.filter(
        (item) =>
          item.nombre?.toLowerCase().indexOf(ev.toLowerCase()) > -1 ||
          item.celular?.toLowerCase().indexOf(ev.toLowerCase()) > -1 ||
          item.correo?.toLowerCase().indexOf(ev.toLowerCase()) > -1 ||
          item.boletosNum.includes(ev)
      );
    }
  }

  openModal(content, boleto) {
    this.clienteSelect = boleto;
    this.modalService.open(content, {
      backdropClass: 'light-blue',
      size: 'sm',
    });
    this.listarBoletos();
  }

  listarBoletos() {
    this.spinner.show();
    this.boletosServ.listarBoletos(this.clienteSelect).then((data: any) => {
      this.spinner.hide();
      this.boletos = data.boletos;
    });
  }

  openModalCupones(content) {
    this.modalService.open(content, {
      backdropClass: 'light-blue',
      size: 'lg',
    });
    this.listarCupones();
  }

  guardarCupon() {
    this.spinner.show();
    this.boletosServ.crearCupon(this.cupon).then(() => {
      this.spinner.hide();
      this.listarCupones();
      this.cupon = {};
    });
  }

  listarCupones() {
    this.spinner.show();
    this.boletosServ.listarCupones().then((data: any) => {
      this.spinner.hide();
      this.cupones = data.cupones;
    });
  }

  eliminarCupon(cupon) {
    this.spinner.show();
    this.boletosServ.eliminarCupon(cupon).then(() => {
      this.spinner.hide();
      this.listarCupones();
    });
  }

  openModalSorteos(content) {
    this.modalService.open(content, {
      backdropClass: 'light-blue',
      size: 'lg',
    });
    this.listarSorteos();
  }

  listarSorteos() {
    this.spinner.show();
    this.sorteosServ.listar().then((data: any) => {
      this.spinner.hide();
      this.sorteos = data.sorteos;
    });
  }

  crearSorteo() {
    this.spinner.show();
    this.sorteosServ.crear(this.sorteo).then((data: any) => {
      this.spinner.hide();
      this.listarSorteos();
      this.sorteo = {};
    });
  }

  eliminarSorteo(sorteo) {
    this.spinner.show();
    this.sorteosServ.eliminar(sorteo).then(() => {
      this.spinner.hide();
      this.listarSorteos();
    });
  }

  pagoManual(cliente) {
    this.spinner.show();
    this.pagosServ.pagoManual(cliente).then((data) => {
      this.spinner.hide();
      this.listarClientes();
    });
  }

  liberarBoletos(id_cliente) {
    this.spinner.show();
    this.boletosServ.liberarBoletos({ id_cliente: id_cliente }).then(() => {
      this.spinner.hide();
      this.listarClientes();
    });
  }
}
