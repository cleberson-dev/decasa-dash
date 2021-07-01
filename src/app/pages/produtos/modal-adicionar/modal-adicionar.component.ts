import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { Department } from '../produtos.component';

@Component({
  selector: 'ngx-modal-adicionar',
  templateUrl: './modal-adicionar.component.html',
  styleUrls: ['./modal-adicionar.component.scss']
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
  // selectedCategory: string = 'mais-vendidos';

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getAllProducts()
      .subscribe(data => {
        this.produtos = data.content.map(produto => ({
          ...produto,
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      });
    this.loading = false;
  }

  selectedCategoryChange(e: any) {
    if (e === 'mais-vendidos') {
      this.apiService.getProdutosMaisVendidos()
      .subscribe(produtos => {
        this.produtos = produtos.map(produto => ({
          ...produto,
          foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
        }));
      });
    }
    const categoriaId =  Number(e);
    this.apiService.getProdutosPorCategoria(categoriaId)
      .subscribe(data => {
        this.produtos = data.content.map(p => ({ ...p, foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg' }));
      });
  }

  handleSubmitClick() {
    const data = this.productsToDefinePrices.map(product => ({
      ...product,
      preco: this.priceForms.controls['preco-'+product.id].value,
      estoqueMinimo: this.priceForms.controls['estoqueMinimo-'+product.id].value
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
          'preco-'+p.id, 
          new FormControl(0, [Validators.required, Validators.min(0)])
        ]),
        ...this.productsToDefinePrices.map((p) => [
          'estoqueMinimo-'+p.id, 
          new FormControl(1, [Validators.required, Validators.min(1)])
        ])
      ])
    );
  }


  onProductCheck(produtoId: number, checked: boolean) {
    if (checked) {
      const selectedProduct = this.produtos.find(p => p.id === produtoId);
      this.selectedProducts.push(selectedProduct);
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p.id !== produtoId);
    }
  }

  isProductSelected(productId: number) {
    return this.selectedProducts.some(p => p.id === productId);
  }

  get mappedProducts() { // ????
    return this.produtos.map((produto): ProdutoLojista => ({ produto }))
  }
}
