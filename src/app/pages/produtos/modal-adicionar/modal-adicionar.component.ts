import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { ResumidoProdutoLojista } from '../../../types';
import { Department } from '../produtos.component';

export type AddProductItem = ResumidoProdutoLojista & { selected?: boolean };

const marcas = {
  nike: { id: 1, nome: 'Nike' },
  fender: { id: 2, nome: 'Fender' },
  samsung: { id: 3, nome: 'Samsung' },
  apple: { id: 4, nome: 'Apple' },
  amanco: { id: 5, nome: 'Amanco' },
}

const modelos = {
  airMax: { id: 1, nome: 'AirMax' },
  stratocaster: { id: 2, nome: 'Stratocaster' },
  galaxy: { id: 3, nome: 'Galaxy S21' },
  iPhone: { id: 4, nome: 'iPhone X' },
  modelo5: { id: 5, nome: 'Modelo #5' },
}

const categorias = {
  smartphones: { id: 1, nome: 'Smartphones' },
  tablets: { id: 2, nome: 'Tablets' },
  fixos: { id: 3, nome: 'Telefones Fixos' },
  notebooks: { id: 4, nome: 'Notebooks' },
  aio: { id: 5, nome: 'Computadores All-in-One' },
  workstations: { id: 6, nome: 'Workstations' },
  roupas: { id: 7, nome: 'Roupas' },
  calcados: { id: 8, nome: 'Calçados' },
  acessorios: { id: 9, nome: 'Acessórios' },
  relogios: { id: 10, nome: 'Relógios' },
  geladeiras: { id: 11, nome: 'Geladeiras' },
  fogoes: { id: 12, nome: 'Fogões' },
  sofas: { id: 13, nome: 'Sofás' },
}

const departamentos = {
  informatica: { id: 1, nome: 'Informática' },
  moda: { id: 2, nome: 'Moda' },
  musica: { id: 3, nome: 'Música' },
  moveis: { id: 4, nome: 'Móveis' },
  celulares: { id: 5, nome: 'Celulares' },
}

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
