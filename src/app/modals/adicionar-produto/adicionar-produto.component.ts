import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { ProdutosService } from '../../services/produtos.service';
import { Department } from '../../pages/produtos/solicitar/solicitar.component';
import { NgxSpinnerService } from 'ngx-spinner';

type AddProductItem = {
  produto: Produto;
  valor: number;
  estoqueMinimo: number;
};

@Component({
  selector: 'modal-adicionar-produto',
  templateUrl: './adicionar-produto.component.html',
  styleUrls: ['./adicionar-produto.component.scss'],
})
export class AdicionarProdutoModalComponent implements OnInit {
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
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.spinner.show("produtos-spinner");
    this.produtosService.todos()
      .subscribe(
        (data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
          this.spinner.hide("produtos-spinner");
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter todos os produtos');
          this.spinner.hide("produtos-spinner");
        }
      );
    this.loading = false;
  }

  handleError(err: any) {
    this.toastrService.danger(err);
  }

  selectedCategoryOptionsChange(option: string) {
    this.selectedCategory = option;
    this.produtos = [];
    this.pagination = null;

    this.spinner.show("produtos-spinner");

    switch (option) {
      case 'mais-vendidos':
        this.produtosService.maisVendidos()
          .subscribe(
            (data) => {
              this.produtos = [...data.content];
              this.pagination = { ...data };
              this.spinner.hide("produtos-spinner");
            },
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter produtos mais vendidos');
              this.spinner.hide("produtos-spinner");
            }
          );
        break;
      case 'todos':
        this.produtosService.todos()
          .subscribe(
            (data) => {
              this.produtos = [...data.content];
              this.pagination = { ...data };
              this.spinner.hide("produtos-spinner");
            },
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter todos os produtos');
              this.spinner.hide("produtos-spinner");
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
              this.spinner.hide("produtos-spinner");
            }, 
            err => {
              console.error(err);
              this.toastrService.danger(err.error.message, 'Impossível obter produtos por categoria');
              this.spinner.hide("produtos-spinner");
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

    this.produtos = [];
    this.pagination = null;

    this.spinner.show("produtos-spinner");
    
    if (['mais-vendidos', 'todos'].includes(category)) {
      this.produtosService.buscarPorDescricao(query).subscribe((data) => {
        alert('achou! ' + data.content.length);
        this.produtos = data.content;
        this.spinner.hide("produtos-spinner");
      });
      return;
    }

    this.produtosService
      .buscarPorDescricaoECategoria(query, Number(category))
      .subscribe(
        (data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
          this.spinner.hide("produtos-spinner");
        }, 
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível buscar produto por categoria');
          this.spinner.hide("produtos-spinner");
        }
      );
  }

  onPageChange(changedPage: number) {
    this.produtos = [];
    this.pagination = null;
    this.spinner.show("produtos-spinner");

    this.produtosService
      .todos({ page: changedPage })
      .subscribe(
        data => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
          this.spinner.hide("produtos-spinner");
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, `Impossível obter todos os produtos (página: ${changedPage})`);
          this.spinner.hide("produtos-spinner");
        }
      );
  }
}
