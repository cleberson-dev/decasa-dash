import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogService, NbMenuItem, NbMenuService, NbToastrService } from '@nebular/theme';
import { TreeItem } from '../../../components/tree/tree.component'
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Department } from '../solicitar/solicitar.component';
import { filter } from 'rxjs/operators';

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
      data: 'todos',
    },
    { 
      title: 'Mais vendidos',
      icon: 'bar-chart-2-outline',
      data: 'mais-vendidos',
    },
  ];

  currentCategory?: number;
  loading: boolean = false;
  pagination: PaginationHeader;

  searchControl = new FormControl('');

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private authService: AuthService,
    private menuService: NbMenuService,
  ) {}

  onPageChange(changedPage: number) {
    this.apiService
      .getProdutosLojistaPorCategoria(
        this.currentCategory,
        this.authService.lojista.id,
        { page: changedPage }
      )
      .subscribe(
        data => {
          this.produtosLojista = [...data.content];
          this.pagination = { ...data };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter produtos do lojista por categoria');
        }
      );
  }

  ngOnInit(): void {
    this.menuService.onItemClick()
      .pipe(filter(({ tag }) => tag === 'main-menu'))
      .subscribe(({ item }) => {
        this.smartGroup = this.smartGroup.map(menuItem => ({...menuItem, selected: item.data === menuItem.data }));
        this.currentCategory = undefined;
        switch (item.data) {
          case 'todos':
            this.apiService
              .getProdutosLojista(this.authService.lojista.id)
              .subscribe(
                data => {
                  this.produtosLojista = [...data.content];
                  this.pagination = { ...data };
                },
                err => {
                  console.error(err);
                  this.toastrService.danger(err.error.message, 'Impossível obter produtos do lojista');
                }
              );
            break;
          case 'mais-vendidos':
          default:
            this.apiService
              .getProdutosLojistaMaisVendidos(this.authService.lojista.id)
              .subscribe(
                data => {
                  this.produtosLojista = [...data.content];
                  this.pagination = { ...data };
                },
                err => {
                  console.error(err);
                  this.toastrService.danger(err.error.message, 'Impossível obter produtos do lojista mais vendidos');
                }
              );
          
        }
      })
    this.apiService.getDepartments()
      .subscribe(
        departments => {
          this.departments = departments;

          this.departmentTree = this.departments
            .map(department => ({
              name: department.name.toUpperCase(),
              icon: 'bookmark',
              value: department.id + '',
              children: department.categories.map(cat => ({
                name: cat.name.toUpperCase(), value: cat.id + '', icon: 'folder-outline', active: false
              }))
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          this.loadingDepartments = false;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter departamentos');
        }
      );


    this.apiService
      .getProdutosLojista(this.authService.lojista.id)
      .subscribe(
        data => {
          this.produtosLojista = [...data.content];
          this.pagination = { ...data };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter produtos do lojista');
        }
      );
  }

  onItemSelected(value: string) {
    console.log('Item clicked', value);
    this.smartGroup = this.smartGroup.map(item => ({ ...item, selected: false }));
    this.apiService.getProdutosLojistaPorCategoria(Number(value), this.authService.lojista.id)
    .subscribe(
      data => {
        this.produtosLojista = [...data.content];
        this.pagination = { ...data };
        this.currentCategory = Number(value);
      },
      ({ error }) => {
        console.error(error);
        this.toastrService.danger(error.message || "Sem mensagem", "Impossível obter produtos do lojista por categoria");
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
    const lojistaId = this.authService.lojista.id;
    this.apiService
      .addProdutos(items, lojistaId)
      .subscribe(
        () => {
          this.produtosLojista.push(...items.map((item): ProdutoLojista => ({
            lojistaDTO: { id: lojistaId },
            valor: item.valor,
            produto: item.produto,
            estoqueMinimo: item.estoqueMinimo
          })));
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível adicionar produtos ao catálogo do lojista');
        }
      );
  }

  searchProducts() {
    const query = this.searchControl.value;
    this.apiService.buscarProdutoLojista(query, this.authService.lojista.id)
      .subscribe(
        data => {
          this.produtosLojista = [...data.content];
          this.pagination = { ...data };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível buscar produtos do lojista');
        }
      );
  }

  onSearchKeyDown(e: KeyboardEvent) {
    if (e.code !== 'Enter') return;
    this.searchProducts();
  }
}
