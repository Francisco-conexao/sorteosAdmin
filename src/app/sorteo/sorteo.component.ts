import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { BoletosService } from '../services/boletos.service';
import { PagosService } from '../services/pagos.service';
import Swal from 'sweetalert2';
import { SorteosService } from '../services/sorteos.service';

@Component({
    selector: 'app-sorteo',
    templateUrl: './sorteo.component.html',
    styleUrls: ['./sorteo.component.scss']
})
export class SorteoComponent implements OnInit {

    boletos:any = []
    boletos2:any = []
    boletosSelect:any = [];
    boletosSelectRandom:any = [];
    buscar:string;

    @ViewChild('modalCupon') modalCupon:any;

    el = document.getElementById('anim');

    numBoletos:number = 1; 
    animacion:number = 0;

    paquetes:any = [{id:1, boletos:1, precio:150, fecha:'2022-06-17', estatus:1, color:''},{id:2, boletos:4, precio:300, fecha:'2022-06-17', estatus:0, color:'rosa'},{id:3, boletos:9, precio:1350, fecha:'2022-06-17', estatus:0, color:'verde'}]
    paquete:any = {};

    cliente:any = {};

    cupon:string = null;

    cuponValido:any = {};

    sorteos:any = null;
    sorteoSelect:any = {};

    constructor(private modalService: NgbModal, private pagosServ: PagosService, private boletosServ: BoletosService, private spinner: NgxSpinnerService,
        private sorteosServ: SorteosService) {
        this.borrarApartados();
        
    }

    ngOnInit(): void {
    }

    borrarApartados(){
        this.pagosServ.borrarApartados().then(()=>{
            
            this.listarSorteos();
        })
    }

    listarSorteos(){
        this.spinner.show()
        this.sorteosServ.listar().then((data:any)=>{
            this.spinner.hide();
            if(data.sorteos){
                this.sorteos = data.sorteos;

                this.sorteos.forEach(item => {
                    if(item.select == 1){
                       this.sorteoSelect = item;
                    }
                });
                this.paquetes[0].precio = this.sorteoSelect.precio1;
                this.paquetes[1].precio = this.sorteoSelect.precio4;
                this.paquetes[2].precio = this.sorteoSelect.precio9;
                console.log(this.paquetes)
                this.listarBoletos(this.sorteoSelect);
                this.abrirModalCupon(this.modalCupon);
            }
        })
    }

    listarBoletos(sorteoSelect){
        this.spinner.show();
        this.pagosServ.listarBoletos(sorteoSelect).then((data:any)=>{
            this.spinner.hide();
            const fill = (number, len) =>"0".repeat(len - number.toString().length) + number.toString();

            this.boletos = [];
            for (let i = 0; i < 5000; i++) {   
                this.boletos.push({num: fill(i,4), vendido:0, select:0}) 
            }

            if(data.boletos){
                this.boletos.forEach(item1 => {
                    data.boletos.forEach(item2 => {
                        if(item1.num == item2.boleto){
                            item1.vendido = 1;
                        }
                    });    
                }); 
            }
             
            this.boletos2 = this.boletos;
            this.paquete = this.paquetes[0];
        })
    }

    getItems(ev) {
        this.boletos = this.boletos2;
        const val = ev.toString();
        if (val) {
            this.boletos = this.boletos.filter((item) => {
                return (item.num.indexOf(val) > -1);
            })
        }
    }

    selecNum(boleto){
        if(boleto.vendido == 0){
            if(this.boletosSelect.length < this.paquete.boletos){
                boleto.select = !boleto.select&&true;
            }else{
                boleto.select = boleto.select&&false;
            }
            this.boletosSelect = this.boletos.filter(boleto =>{
                if(boleto.select == true){
                    return boleto;
                }
            })
        }
            
    }

    abrirModal(content) {
        this.modalService.open(content, { backdropClass: 'light-blue', size: 'md' })
        this.boletosSelect = [];
        this.boletosSelectRandom = [];
        this.animacion = 0;
        this.borrarSelect();
    }

    abrirModalCompra(content) {
        this.modalService.open(content, { backdropClass: 'light-blue', size: 'md' })
    }

    abrirModalCupon(content){
        this.modalService.open(content, { backdropClass: 'light-blue', size: 'sm' })
    }

    generarBoletos(){
        this.boletosSelectRandom = [];
        for (let index = 0; index < this.paquete.boletos; index++) {
            let random = Math.floor(Math.random()* (4999 - 0)+ 0);
            if(this.boletos[random].vendido){
                index--;
            }else{
                console.log(this.boletosSelectRandom.find(data => data.num == this.boletos[random].num))
                if(this.boletosSelectRandom.find(data => data.num == this.boletos[random].num)){
                    index--;
                }else{
                    this.boletosSelectRandom.push(this.boletos[random]);
                }
                
            }
        }
        this.animacion = 1;
        setTimeout(() => {
            this.animacion = 2;
        }, 6000);
    }

    losQuiero(){
        this.borrarSelect();
        this.boletosSelect = this.boletosSelectRandom.filter(item=>{
            item.select = 1;
            return item;
        })
        this.modalService.dismissAll();
    }

    borrarSelect(){
        this.boletos.forEach(item => {
            item.select = 0;
        });
    }

    elegirPaquete(paquete){
        if(!this.cuponValido.cupon){
            let boletosRes = this.boletos.filter(data => data.vendido == 0);
            if(boletosRes.length >= paquete.boletos){
                this.paquetes.forEach(item => {
                    item.estatus = 0;  
                });
                paquete.estatus = 1;
                this.paquete = paquete;
            }
        }
    }


    pagar(){
        console.log(this.boletosSelect);
        let boletos:any = [];
        this.boletosSelect.forEach(item => {
            boletos.push(item.num)
            item.vendido = 1;
        });
        this.pagosServ.pagos({cliente:this.cliente, boletos:boletos, paquete:this.paquete, sorteo:this.sorteoSelect}).then((data:any)=>{
            this.modalService.dismissAll();
            this.boletosSelect = [];
            window.open(data.url);
        })
    }

    ValidarCupon(){
        this.spinner.show();
        this.boletosServ.validarCupon({cupon: this.cupon}).then((data:any)=>{
            this.spinner.hide();
            this.modalService.dismissAll();
            if(data.status == 200){
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Bien!',
                    text: 'Cupon valido por '+data.cupon.boletos+' boletos',
                })
                this.paquetes.forEach(item => {
                    if(item.boletos == data.cupon.boletos){
                        console.log(item);
                        this.elegirPaquete(item);
                    }
                });
                this.cuponValido = data.cupon;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: '¡Oops!',
                    text: 'Cupon no valido',
                })
            }

        })
    }

    canjearBoletos(){
        this.spinner.show();
        this.boletosServ.canjearBoletos({cupon: this.cuponValido, boletos: this.boletosSelect, cliente:this.cliente, sorteo:this.sorteoSelect}).then((data:any)=>{
            this.spinner.hide();
            this.boletosSelect = [];
            this.cuponValido = {};
            this.modalService.dismissAll();
            this.listarBoletos(this.sorteoSelect);
        })
    }

    selecSorteo(sorteo){
        this.sorteos.forEach(item => {
            item.select = 0;
        });
        sorteo.select = 1;
        this.sorteoSelect = sorteo;
        this.paquetes[0].precio = this.sorteoSelect.precio1;
        this.paquetes[1].precio = this.sorteoSelect.precio4;
        this.paquetes[2].precio = this.sorteoSelect.precio9;
        this.listarBoletos(this.sorteoSelect);
    }
}
