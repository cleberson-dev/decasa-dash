import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogService, NbMenuItem } from '@nebular/theme';
import { TreeItem } from '../../../components/tree/tree.component'
import { ApiService } from '../../../services/api.service';
import { Department } from '../produtos.component';
import { ResumidoProdutoLojista } from '../../../types';
import { AddProductItem } from '../modal-adicionar/modal-adicionar.component';

@Component({
  selector: 'tab-meus-produtos',
  templateUrl: './meus-produtos.component.html',
  styleUrls: ['./meus-produtos.component.scss']
})
export class MeusProdutosComponent implements OnInit {
  @Input() departments: Department[];
  @Input() departmentTree: TreeItem[];
  @Output() requestClick = new EventEmitter();
  
  currentProductsPage: number;
  products: ResumidoProdutoLojista[] = [];
  
  smartGroup: NbMenuItem[] = [
    { 
      title: 'Mais Vendidos',
      icon: 'grid',
      selected: true,
    },
    { 
      title: 'Outra',
      icon: 'bar-chart-2-outline'
    },
  ];

  currentCategory = 1;
  loading: boolean = false;
  pagination = {
    currentPage: 1,
    totalItems: 1,
    itemsPerPage: 1
  }

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService
  ) {
  }

  onPageChange(page: number) {
    this.apiService
      .getProductsByCategory(
        this.currentCategory + '',
        { page }
      )
      .subscribe(this.handleFetch);
  }

  handleFetch(data: any) {
    this.products = data.content.map((p): AddProductItem => ({
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

    this.pagination = {
      ...this.pagination,
      itemsPerPage: data.size,
      totalItems: data.totalElements 
    }

    console.log(this.products, this.pagination);
  }

  ngOnInit(): void {
    // this.apiService
    //   .getProductsByCategory(
    //     this.currentCategory + '',
    //   )
    //   .subscribe(this.handleFetch);
  }

  onItemSelected(value: string) {
    console.log('Item clicked', value);
    this.currentCategory = Number(value);
    this.apiService.getProductsByCategory(this.currentCategory + '')
      .subscribe(this.handleFetch);
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  btnClickHandler(ref: any) {
    this.requestClick.emit('solicitar');
    ref.close();
  }

  onSubmitHandler(products: AddProductItem[]) {
    console.log(products);
    this.products.push(...products);
  }
}
