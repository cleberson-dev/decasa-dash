import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TheadTitlesRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-titles-row.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

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
    private api: ApiService,
    private toastrService: NbToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.selectedFornecedores.push(...this.initialFornecedores);
    this.api.getFornecedoresPorLojista(this.authService.lojista.id)
      .subscribe(
        data => {
          this.fornecedores = data.content;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter fornecedores');
        }
      );
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
