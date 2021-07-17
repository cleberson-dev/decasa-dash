import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { ProdutosService } from '../../../services/produtos.service';
import { Department } from '../solicitar/solicitar.component';

type AddProductItem = {
  produto: Produto;
  valor: number;
  estoqueMinimo: number;
};

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss'],
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: NbDialogRef<any>;
  @Input() departments: Department[];
  @Output() requestProductBtnClick = new EventEmitter();
  @Output() submitClick = new EventEmitter<AddProductItem[]>();

  produtos: Produto[] = [];
  selectedProducts: Produto[] = [];
  productsToDefinePrices: Produto[] = [];
  priceForms: FormGroup = new FormGroup({});
  loading: boolean = false;
  searchControl = new FormControl('');
  pagination: PaginationHeader;
  selectedCategory: string = 'todos';

  constructor(
    private toastrService: NbToastrService,
    private produtosService: ProdutosService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.produtosService.todos()
      .subscribe(
        (data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter todos os produtos');
        }
      );
    this.loading = false;
  }

  handleError(err: any) {
    this.toastrService.danger(err);
  }

  selectedCategoryOptionsChange(option: string) {
    this.selectedCategory = option;
    switch (option) {
      case 'mais-vendidos':
        this.produtosService.maisVendidos()
          .subscribe(
            (data) => {
              this.produtos = [...data.content];
              this.pagination = { ...data };
            },
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter produtos mais vendidos');
            }
          );
        break;
      case 'todos':
        this.produtosService.todos()
          .subscribe(
            (data) => {
              this.produtos = [...data.content];
              this.pagination = { ...data };
            },
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter todos os produtos');
            }
          );
        break;
      default:
        const categoriaId = Number(option);
        this.produtosService
          .porCategoria(categoriaId)
          .subscribe(
            (data) => {
              this.produtos = [...data.content];
              this.pagination = { ...data };
            }, 
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter produtos por categoria');
            }
          );
    }
  }

  handleSubmitClick() {
    const body = this.productsToDefinePrices.map(produto => ({
      produto,
      valor: this.priceForms.controls['preco-' + produto.id].value,
      estoqueMinimo:
        this.priceForms.controls['estoqueMinimo-' + produto.id].value,
    }));
    this.submitClick.emit(body);
    this.ref.close();
  }

  nextBtnHandler() {
    this.productsToDefinePrices = [...this.selectedProducts];
    this.priceForms = new FormGroup(
      Object.fromEntries([
        ...this.productsToDefinePrices.map((p) => [
          'preco-' + p.id,
          new FormControl(0, [Validators.required, Validators.min(0)]),
        ]),
        ...this.productsToDefinePrices.map((p) => [
          'estoqueMinimo-' + p.id,
          new FormControl(1, [Validators.required, Validators.min(1)]),
        ]),
      ])
    );
  }

  onProductCheck(produtoId: number, checked: boolean) {
    if (checked) {
      const selectedProduct = this.produtos.find((p) => p.id === produtoId);
      this.selectedProducts.push(selectedProduct);
    } else {
      this.selectedProducts = this.selectedProducts.filter(
        (p) => p.id !== produtoId
      );
    }
  }

  isProductSelected(productId: number) {
    return this.selectedProducts.some((p) => p.id === productId);
  }

  searchProducts() {
    const query = this.searchControl.value;
    const category = this.selectedCategory;

    if (['mais-vendidos', 'todos'].includes(category)) {
      this.produtosService.buscarPorDescricao(query).subscribe((data) => {
        alert('achou! ' + data.content.length);
        this.produtos = data.content;
      });
      return;
    }

    this.produtosService
      .buscarPorDescricaoECategoria(query, Number(category))
      .subscribe(
        (data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
        }, 
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível buscar produto por categoria');
        }
      );
  }

  onPageChange(changedPage: number) {
    this.produtosService
      .todos({ page: changedPage })
      .subscribe(
        data => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, `Impossível obter todos os produtos (página: ${changedPage})`);
        }
      );
  }
}
