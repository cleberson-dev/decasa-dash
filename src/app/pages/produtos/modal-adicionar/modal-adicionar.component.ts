import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { categorias, departamentos, marcas, modelos } from '../../../fake-data';
import { ApiService } from '../../../services/api.service';
import { AddProductItem, ResumidoProdutoLojista } from '../../../types';
import { Department } from '../produtos.component';

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: NbDialogRef<any>;
  @Input() departments: Department[];
  @Output() requestProductBtnClick = new EventEmitter();
  @Output() submitClick = new EventEmitter();

  produtos: AddProductItem[] = [
    {
      id: 1,
      nome: 'Produto #1',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 2,
      nome: 'Produto #2',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 3,
      nome: 'Produto #3',
      marca: marcas.amanco,
      modelo: modelos.modelo5,
      categoria: categorias.smartphones,
      departamento: departamentos.musica,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 4,
      nome: 'Produto #4',
      marca: marcas.fender,
      modelo: modelos.galaxy,
      categoria: categorias.sofas,
      departamento: departamentos.informatica,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 5,
      nome: 'Produto #5',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    }
  ];
  productsToDefinePrices: ResumidoProdutoLojista[] = [];
  priceForms: FormGroup = new FormGroup({});
  loading: boolean = false;
  selectedCategory: string = '';

  constructor(
    private apiService: ApiService
  ) {}

  get filteredProducts() {
    console.log(this.selectedCategory);
    return this.selectedCategory !== '' ? this.produtos.filter(produto => String(produto.categoria.id) === String(this.selectedCategory)) : this.produtos;
  }

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
    console.log('Selected change', e);
    this.selectedCategory = String(e);
    // this.apiService.getProductsByCategory(String(e))
    //   .subscribe((data: any) => {
    //     this.produtos = data.content.map((p): AddProductItem => ({
    //       id: p.id,
    //       nome: p.descricao,
    //       marca: {
    //         id: p.modelo.marca.id,
    //         nome: p.modelo.marca.descricao
    //       },
    //       modelo: {
    //         id: p.modelo.id,
    //         nome: p.modelo.descricao
    //       },
    //       categoria: {
    //         id: p.categoria.id,
    //         nome: p.categoria.descricao
    //       },
    //       departamento: {
    //         id: p.categoria.departamento.id,
    //         nome: p.categoria.departamento.descricao
    //       },
    //       selected: false,
    //       foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    //     }));
    //   })
    this.loading = false;
  }

  handleSubmitClick() {
    console.log(this.priceForms);
    this.submitClick.emit(
      this.productsToDefinePrices.map(product => ({
        ...product,
        preco: this.priceForms.controls[''+product.id].value
      }))
    );
    this.ref.close();
  }

  nextBtnHandler() {
    this.productsToDefinePrices = this.produtos
      .filter(produto => produto.selected);
    this.priceForms = new FormGroup(
      Object.fromEntries(
        this.productsToDefinePrices.map((p) => [
          ''+p.id, 
          new FormControl('', [Validators.required, Validators.min(0)])
        ])
      )
    );
  }
}
