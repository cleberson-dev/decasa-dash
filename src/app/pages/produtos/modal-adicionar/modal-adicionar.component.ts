import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IProdutoLojista } from '../../../components/produto-lojista/produto-lojista.component';

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
})
export class ModalAdicionarComponent implements OnInit {

  @Output() cancelBtnClick = new EventEmitter();
  @Output() requestBtnClick = new EventEmitter();

  produtos: (IProdutoLojista | { selected?: boolean })[] = [ 
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #1',
      marca: 'Marca #1',
      modelo: 'Modelo #1',
      categories: ['Videogames', 'Móveis'],
      selected: true
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
