import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogService, NbMenuItem } from '@nebular/theme';
import { TreeItem } from '../../../components/tree/tree.component'
import { ApiService } from '../../../services/api.service';
import { Department } from '../produtos.component';

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

  searchControl = new FormControl('');

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService
  ) {
  }

  onPageChange(page: number) {
    this.apiService
      .getProductsByCategory(
        this.currentCategory,
        { page }
      )
      .subscribe(this.handleFetch);
  }

  handleFetch(data: any) {
    this.products = data.content.map(p => ({
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
    this.apiService.getProductsByCategory(this.currentCategory)
      .subscribe(this.handleFetch);
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  btnClickHandler(ref: any) {
    this.requestClick.emit('solicitar');
    ref.close();
  }

  onSubmitHandler(products: ResumidoProdutoLojista[]) {
    this.apiService
      .addProdutos(products.map(p => ({
        lojistaId: 2,
        produtoId: p.id as number,
        preco: p.preco,
        estoqueMinimo: p.estoqueMinimo
      })))
      .subscribe(() => {
        this.products.push(...products);
      });
  }

  searchProducts() {
    const query = this.searchControl.value;
    this.apiService.buscarProdutoLojista(query)
      .subscribe(data => alert(`Consulta: ${query} | Resultados: ${data.content.length}`));
  }

  onSearchKeyDown(e: KeyboardEvent) {
    if (e.code !== 'Enter') return;
    this.searchProducts();
  }
}
