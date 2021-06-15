import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-cupons',
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss']
})
export class CuponsComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Dados Cadastrais', link: '/clientes'},
    { title: 'Cupons', link: '/clientes/cupons', active: true },
    { title: 'Compras', link: '/clientes/compras' },
    { title: 'Devoluções', link: '/clientes/devolucoes' },
    { title: 'Endereços', link: '/clientes/enderecos' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
