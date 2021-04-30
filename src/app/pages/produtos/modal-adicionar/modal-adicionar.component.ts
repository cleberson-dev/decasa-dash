import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { IProdutoLojista } from '../../../components/produto-lojista/produto-lojista.component';

export type AddProductItem = IProdutoLojista & { selected?: boolean };

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: TemplateRef<any>;

  foto = 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'

  produtos: AddProductItem[] = [ 
    {
      foto: this.foto,
      nome: 'Produto #1',
      marca: 'Marca #1',
      modelo: 'Modelo #1',
      categories: ['Videogames', 'Móveis'],
      selected: true
    },
    {
      foto: this.foto,
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: this.foto,
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: this.foto,
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
    {
      foto: this.foto,
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
    },
  ];

  get selectedProducts() {
    return this.produtos.filter(produto => produto.selected);
  }


  step = 1;

  ngOnInit(): void {
  }

  changeScreen() {
    this.step += 1;
  }
}
