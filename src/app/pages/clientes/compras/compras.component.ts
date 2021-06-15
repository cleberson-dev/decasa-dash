import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Dados Cadastrais', link: '/clientes'},
    { title: 'Cupons', link: '/clientes/cupons' },
    { title: 'Compras', link: '/clientes/compras', active: true },
    { title: 'Devoluções', link: '/clientes/devolucoes' },
    { title: 'Endereços', link: '/clientes/enderecos' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
