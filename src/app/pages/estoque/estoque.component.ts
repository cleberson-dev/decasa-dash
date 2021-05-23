import { Component, OnInit } from '@angular/core';
import { Tab } from '../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: true },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Tombamento', link: '/estoque/tombamento', active: false },
  ];

  data = [
    { codigo: '00001', nome: 'Produto #1', unidade: 'cm', quantidade: 5 },
    { codigo: '00002', nome: 'Produto #2', unidade: 'kg', quantidade: 2 },
    { codigo: '00003', nome: 'Produto #3', unidade: 'pacote', quantidade: 5 },
    { codigo: '00004', nome: 'Produto #4', unidade: 'litro', quantidade: 3 },
    { codigo: '00005', nome: 'Produto #5', unidade: 'caixa', quantidade: 5 },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
