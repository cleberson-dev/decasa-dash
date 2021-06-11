import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  lojas = [
    { nome: 'Loja 01', cnpj: '99.999.999/9999-99', collapsed: false },
    { nome: 'Loja 02', cnpj: '88.888.888/8888-88', collapsed: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
