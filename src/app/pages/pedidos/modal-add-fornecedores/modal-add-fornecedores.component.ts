import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';

type SelectableFornecedor = Fornecedor & { selected?: boolean; };

@Component({
  selector: 'ngx-modal-add-fornecedores',
  templateUrl: './modal-add-fornecedores.component.html',
  styleUrls: ['./modal-add-fornecedores.component.scss']
})
export class ModalAddFornecedoresComponent implements OnInit {
  @Output() btnClick = new EventEmitter();
  @Output() exit = new EventEmitter();
  @Output() addition = new EventEmitter<Fornecedor[]>();
  @Input() initialFornecedores: Fornecedor[] = [];
  
  fornecedores: Fornecedor[] = [];
  @Input() selectedFornecedores: Fornecedor[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.selectedFornecedores.push(...this.initialFornecedores);
    this.api.getFornecedores()
      .subscribe(fornecedores => {
        this.fornecedores = fornecedores;
      });
  }

  onAdditionBtnClick() {
    this.addition.emit([...this.selectedFornecedores]);
    this.selectedFornecedores = [];
  }

  onCloseBtnClick() {
    this.selectedFornecedores = [];
    this.exit.emit();
  }

  onSelect(checked: boolean, fornecedor: Fornecedor) {
    if (!checked) {
      this.selectedFornecedores = this.selectedFornecedores.filter(f => f.id !== fornecedor.id);
      return;
    }

    this.selectedFornecedores.push(fornecedor);
  }

  isFornecedorSelecionado(fornecedorId: number) {
    return this.selectedFornecedores.some(f => f.id === fornecedorId);
  }
}
