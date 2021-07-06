import { ApplicationRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogService, NbMenuItem, NbToastrService } from '@nebular/theme';
import { TreeItem } from '../../../components/tree/tree.component'
import { ApiService } from '../../../services/api.service';
import { Department } from '../solicitar/solicitar.component';

type AddProductItem = {
  produto: Produto;
  valor: number;
  estoqueMinimo: number;
};

@Component({
  selector: 'tab-meus-produtos',
  templateUrl: './meus-produtos.component.html',
  styleUrls: ['./meus-produtos.component.scss']
})
export class MeusProdutosComponent implements OnInit {
  @Output() requestClick = new EventEmitter();
  departments: Department[];
  departmentTree: TreeItem[];
  loadingDepartments: boolean = true;

  currentProductsPage: number;
  produtosLojista: ProdutoLojista[] = [];
  
  smartGroup: NbMenuItem[] = [
    { 
      title: 'Todos',
      icon: 'grid',
      selected: true,
    },
    { 
      title: 'Mais vendidos',
      icon: 'bar-chart-2-outline'
    },
  ];

  currentCategory = 1;
  loading: boolean = false;
  pagination: PaginationHeader;

  searchControl = new FormControl('');

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService,
    private toastrService: NbToastrService,
  ) {}

  onPageChange(changedPage: number) {
    this.apiService
      .getProdutosLojistaPorCategoria(
        this.currentCategory,
        2,
        { page: changedPage }
      )
      .subscribe(data => {
        this.produtosLojista = [...data.content];
        this.pagination = { ...data };
      });
  }

  ngOnInit(): void {
    this.apiService.getDepartments()
      .subscribe(departments => {
        this.departments = departments;

        this.departmentTree = this.departments.map(department => ({
          name: department.name,
          icon: 'bookmark',
          value: department.id + '',
          children: department.categories.map(cat => ({
            name: cat.name, value: cat.id + '', icon: 'folder-outline', active: false
          }))
        }));

        this.loadingDepartments = false;
      });


    this.apiService
      .getProdutosLojista(2)
      .subscribe(data => {
        this.produtosLojista = [...data.content];
        this.pagination = { ...data };
      });
  }

  onItemSelected(value: string) {
    console.log('Item clicked', value);
    this.apiService.getProdutosLojistaPorCategoria(Number(value), 2)
    .subscribe(
      data => {
        this.produtosLojista = [...data.content];
        this.pagination = { ...data };
        this.currentCategory = Number(value);
      },
      ({ error }) => {
        console.error(error);
        this.toastrService.danger(error.message || "Sem mensagem", "Algo deu errado");
      }
    );
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  btnClickHandler(ref: any) {
    this.requestClick.emit('solicitar');
    ref.close();
  }

  onSubmitHandler(items: AddProductItem[]) {
    const lojistaId = 2;
    this.apiService
      .addProdutos(items, lojistaId)
      .subscribe(() => {
        this.produtosLojista.push(...items.map((item): ProdutoLojista => ({
          lojistaDTO: { id: lojistaId },
          valor: item.valor,
          produto: item.produto
        })));
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
