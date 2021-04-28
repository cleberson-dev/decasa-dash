import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProdutoLojista } from '../../../components/produto-lojista/produto-lojista.component';
import { NbDialogService, NbMenuItem } from '@nebular/theme';
import { TreeItem } from '../../../components/tree/tree.component'

@Component({
  selector: 'tab-meus-produtos',
  templateUrl: './meus-produtos.component.html',
  styleUrls: ['./meus-produtos.component.scss']
})
export class MeusProdutosComponent implements OnInit {

  currentProductsPage: number;

  produtos: IProdutoLojista[] =[ 
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #1',
      marca: 'Marca #1',
      modelo: 'Modelo #1',
      preco: 19.99,
      categories: ['Videogames', 'Móveis']
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
      preco: 1.99 
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
      preco: 19.99  
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
      preco: 19.99  
    },
    {
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg',
      nome: 'Produto #2',
      marca: 'Marca #2',
      modelo: 'Modelo #2',
      preco: 19.99  
    },
  ];

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

  treeItems: TreeItem[] = [
    { 
      name: 'Videogames',
      icon: 'bookmark', 
      value: "1", 
      children: [ 
        { name: "Sub-categoria #1", value: "11", icon: 'folder-outline' },  
        { name: "Sub-categoria #2", value: "12", icon: 'folder-outline' },  
      ] 
    },
    { 
      name: 'Móveis',
      icon: 'bookmark',
      value: "2"
    },
  ];


  @Output() requestClick = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentProductsPage = Number(params.p || 1);
    });
  }

  onItemSelected(name: string) {
    alert(name);
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  btnClickHandler(ref: any) {
    this.requestClick.emit('solicitar');
    ref.close();
  }
}
