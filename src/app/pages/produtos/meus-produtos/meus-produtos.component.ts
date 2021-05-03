import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProdutoLojista } from '../../../components/produto-lojista/produto-lojista.component';
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

  produtos: IProdutoLojista[];

  smartGroup: NbMenuItem[] = [
    { 
      title: 'Todos',
      icon: 'grid',
      selected: true,
    },
    { 
      title: 'Outra',
      icon: 'bar-chart-2-outline'
    },
  ];

  options = [
    { title: 'Arroz' },
    { title: 'Feijão' },
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
    return this.apiService
      .getProductsByCategory(
        this.currentCategory + '',
        { page }
      )
      .subscribe(this.handleFetch);
  }

  handleFetch(data: any) {
    this.produtos = data.content.map(p => ({
      nome: p.descricao,
      marca: p.modelo.marca.descricao,
      modelo: p.modelo.descricao,
      categories: [ p.categoria.descricao + ' - ' + p.categoria.departamento.descricao ],
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    }));

    this.pagination = {
      ...this.pagination,
      itemsPerPage: data.size,
      totalItems: data.totalElements 
    }

    console.log(this.produtos, this.pagination);
  }

  ngOnInit(): void {
    this.apiService
      .getProductsByCategory(
        this.currentCategory + '', 
        { page: 1, itemsPerPage: 10 }
      )
      .subscribe(this.handleFetch);
    ;
  }

  onItemSelected(value: string) {
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
}
