import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  @Output() requestProductBtnClick = new EventEmitter();

  produtos: AddProductItem[] = [];
  productsToDefinePrices: IProdutoLojista[] = [];
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
      .pipe(delay(5000))
      .subscribe((data: any) => {
        this.produtos = data.content.map(p => ({
          id: p.id,
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
          id: p.id,
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
