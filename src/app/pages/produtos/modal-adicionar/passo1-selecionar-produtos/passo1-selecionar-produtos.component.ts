import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { IProdutoLojista } from '../../../../components/produto-lojista/produto-lojista.component';

type AddProductItem = IProdutoLojista & { selected?: boolean };

@Component({
  selector: 'ngx-modal-adicionar-passo1',
  templateUrl: './passo1-selecionar-produtos.component.html',
  styleUrls: ['./passo1-selecionar-produtos.component.scss']
})
export class ModalAdicionarPasso1Component implements OnInit {
  @Input() produtos: AddProductItem[];
  @Input() selectedProducts: AddProductItem[];

  @Output() cancelBtnClick = new EventEmitter();
  @Output() requestBtnClick = new EventEmitter();
  @Output() nextBtnClick = new EventEmitter();

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
