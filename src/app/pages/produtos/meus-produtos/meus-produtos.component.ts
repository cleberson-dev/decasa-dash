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
  produtosLojista: ProdutoLojista[] = [];
  
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
  pagination: PaginationHeader;

  searchControl = new FormControl('');

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService
  ) {
  }

  onPageChange(changedPage: number) {
    this.apiService
      .getProdutosLojistaPorCategoria(
        this.currentCategory,
        2,
        { page: changedPage }
      )
      .subscribe(this.handleFetch);
  }

  handleFetch(data: any) {
    this.produtosLojista = data.content.map(p => ({
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

    this.pagination = { ...data };
  }

  ngOnInit(): void {
    this.apiService
      .getProdutosLojista()
      .subscribe(this.handleFetch);
  }

  onItemSelected(value: string) {
    console.log('Item clicked', value);
    this.currentCategory = Number(value);
    this.apiService.getProdutosLojistaPorCategoria(this.currentCategory)
      .subscribe(this.handleFetch);
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  btnClickHandler(ref: any) {
    this.requestClick.emit('solicitar');
    ref.close();
  }

  onSubmitHandler(products: ProdutoLojista[]) {
    const lojistaId = products[0].lojista.id;
    this.apiService
      .addProdutos(products.map(p => ({
        lojistaId,
        produtoId: p.id as number,
        preco: p.valor,
        estoqueMinimo: p.estoqueMinimo || 1
      })))
      .subscribe(() => {
        this.produtosLojista.push(...products);
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
