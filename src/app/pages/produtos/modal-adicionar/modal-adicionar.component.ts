import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { ResumidoProdutoLojista } from '../../../types';
import { Department } from '../produtos.component';

export type AddProductItem = ResumidoProdutoLojista & { selected?: boolean };

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: NbDialogRef<any>;
  @Input() departments: Department[];
  @Output() requestProductBtnClick = new EventEmitter();

  produtos: AddProductItem[] = [];
  productsToDefinePrices: ResumidoProdutoLojista[] = [];
  priceForms: FormGroup = new FormGroup({});
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
        this.produtos = data.content.map((p): AddProductItem => ({
          id: p.id,
          nome: p.descricao,
          marca: {
            id: p.modelo.marca.id,
            nome: p.modelo.marca.descricao
          },
          modelo: {
            id: p.modelo.id,
            nome: p.modelo.descricao
          },
          categoria: {
            id: p.categoria.id,
            nome: p.categoria.descricao
          },
          departamento: {
            id: p.categoria.departamento.id,
            nome: p.categoria.departamento.descricao
          },
          selected: false,
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      })
    this.loading = false;
  }

  onSelectedChange(e: any) {
    this.loading = true;
    this.apiService.getProductsByCategory(e)
      .subscribe((data: any) => {
        this.produtos = data.content.map((p): AddProductItem => ({
          id: p.id,
          nome: p.descricao,
          marca: {
            id: p.modelo.marca.id,
            nome: p.modelo.marca.descricao
          },
          modelo: {
            id: p.modelo.id,
            nome: p.modelo.descricao
          },
          categoria: {
            id: p.categoria.id,
            nome: p.categoria.descricao
          },
          departamento: {
            id: p.categoria.departamento.id,
            nome: p.categoria.departamento.descricao
          },
          selected: false,
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      })
    this.loading = false;
  }

  onSubmitHandler() {
    console.log(this.priceForms);
  }

  nextBtnHandler() {
    this.productsToDefinePrices = this.produtos
      .filter(produto => produto.selected);
    this.priceForms = new FormGroup(
      Object.fromEntries(
        this.productsToDefinePrices.map((p) => [''+p.id, new FormControl(0)])
      )
    );
    console.log(this.priceForms);
  }
}
