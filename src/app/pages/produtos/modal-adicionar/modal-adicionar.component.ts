import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { IProdutoLojista } from '../../../components/produto-lojista/produto-lojista.component';
import { ApiService } from '../../../services/api.service';
import { Department } from '../produtos.component';

export type AddProductItem = IProdutoLojista & { selected?: boolean };

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: NbDialogRef<any>;
  @Input() departments: Department[];

  produtos: AddProductItem[] = [];
  loading: boolean = false;
  selectedCategory: string = '';

  constructor(
    private apiService: ApiService
  ) {}

  get selectedProducts() {
    return this.produtos.filter(produto => produto.selected);
  }

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getAllProducts()
      .subscribe((data: any) => {
        this.produtos = data.content.map(p => ({
          nome: p.descricao,
          marca: p.modelo.marca.descricao,
          modelo: p.modelo.descricao,
          categories: [ p.categoria.descricao + ' - ' + p.categoria.departamento.descricao ],
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      })
    this.loading = false;
  }

  onSelectedChange(e: any) {
    this.loading = true;
    this.apiService.getProductsByCategory(e)
      .subscribe((data: any) => {
        this.produtos = data.content.map(p => ({
          nome: p.descricao,
          marca: p.modelo.marca.descricao,
          modelo: p.modelo.descricao,
          categories: [ p.categoria.descricao + ' - ' + p.categoria.departamento.descricao ],
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      })
    this.loading = false;
  }

  onSubmitHandler() {
    console.log(this.selectedProducts);
  }

}
