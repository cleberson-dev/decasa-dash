import { Component, Input, OnInit } from '@angular/core';
import { IProdutoLojista } from '../../../../components/produto-lojista/produto-lojista.component';

export type AddProductItem = IProdutoLojista & { selected?: boolean };

@Component({
  selector: 'ngx-modal-adicionar-passo2',
  templateUrl: './passo2-definir-precos.component.html',
  styleUrls: ['./passo2-definir-precos.component.scss']
})
export class Passo2DefinirPrecosComponent implements OnInit {
  @Input() selectedProducts: AddProductItem[];

  constructor() { }

  ngOnInit(): void {
  }

}
