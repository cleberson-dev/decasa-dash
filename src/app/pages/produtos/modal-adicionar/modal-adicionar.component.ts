import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { Department } from '../solicitar/solicitar.component';

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss'],
})
export class ModalAdicionarComponent implements OnInit {
  @Input() ref: NbDialogRef<any>;
  @Input() departments: Department[];
  @Output() requestProductBtnClick = new EventEmitter();
  @Output() submitClick = new EventEmitter();

  produtos: Produto[] = [];
  selectedProducts: Produto[] = [];
  productsToDefinePrices: Produto[] = [];
  priceForms: FormGroup = new FormGroup({});
  loading: boolean = false;
  searchControl = new FormControl('');
  pagination: PaginationHeader;
  selectedCategory: string = 'todos';

  constructor(
    private apiService: ApiService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getAllProducts().subscribe((data) => {
      this.produtos = [...data.content];
      this.pagination = { ...data };
    });
    this.loading = false;
  }

  handleError(err: any) {
    this.toastrService.danger(err);
  }

  selectedCategoryOptionsChange(option: string) {
    this.selectedCategory = option;
    switch (option) {
      case 'mais-vendidos':
        this.apiService.getProdutosMaisVendidos().subscribe((data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
        }, this.handleError);
        break;
      case 'todos':
        this.apiService.getAllProducts().subscribe((data) => {
          this.produtos = [...data.content];
          this.pagination = { ...data };
        }, this.handleError);
        break;
      default:
        const categoriaId = Number(option);
        this.apiService
          .getProdutosPorCategoria(categoriaId)
          .subscribe((data) => {
            this.produtos = [...data.content];
            this.pagination = { ...data };
          }, this.handleError);
    }
  }

  handleSubmitClick() {
    const data = this.productsToDefinePrices.map((product) => ({
      ...product,
      preco: this.priceForms.controls['preco-' + product.id].value,
      estoqueMinimo:
        this.priceForms.controls['estoqueMinimo-' + product.id].value,
    }));
    console.log(data);
    this.submitClick.emit(data);
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
      this.apiService.buscarProduto(query).subscribe((data) => {
        alert('achou! ' + data.content.length);
        this.produtos = data.content;
      });
      return;
    }

    this.apiService
      .buscarProdutoPorCategoria(query, Number(category))
      .subscribe((data) => {
        this.produtos = [...data.content];
        this.pagination = { ...data };
      }, this.handleError);
  }
}
