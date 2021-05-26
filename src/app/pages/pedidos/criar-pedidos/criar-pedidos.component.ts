import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { categorias, departamentos, marcas, modelos } from '../../../fake-data';
import { Fornecedor, ResumidoProdutoLojista } from '../../../types';
import { Department } from '../../produtos/produtos.component';

type DialogContentType = "addProducts" | "addSuppliers" | "createSupplier";

@Component({
  selector: 'ngx-criar-pedidos',
  templateUrl: './criar-pedidos.component.html',
  styleUrls: ['./criar-pedidos.component.scss']
})
export class CriarPedidosComponent implements OnInit {
  produtos: ResumidoProdutoLojista[] = [
    {
      id: 1,
      descricao: 'Produto #1',
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 2,
      descricao: 'Produto #2',
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 3,
      descricao: 'Produto #3',
      modelo: modelos.modelo5,
      categoria: categorias.smartphones,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 4,
      descricao: 'Produto #4',
      modelo: modelos.galaxy,
      categoria: categorias.sofas,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 5,
      descricao: 'Produto #5',
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    }
  ];

  departments: Department[] = [];

  columns = ['Nome', 'Sobrenome'];
  
  data = [
    ['Cleberson', 'Ferreira Rodrigues Junior']
  ];

  addedProducts: ResumidoProdutoLojista[] = [];

  selectedCategory = '';

  quantityForm = this.fb.group({});

  fornecedores: Fornecedor[] = []

  selectedProducts: ResumidoProdutoLojista[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) { }

  get filteredProducts() {
    return this.selectedCategory === "" ? this.produtos : this.produtos.filter(produto => String(produto.categoria.id) === String(this.selectedCategory))
  }

  uncheckAllProducts() {
    this.selectedProducts = [];
  }

  ngOnInit(): void {

  }

  open(dialog: TemplateRef<any>, type: DialogContentType) {
    this.dialogService.open(dialog, { context: { type } });
  }

  handleProductDialog(dialog: NbDialogRef<any>) {
    this.addedProducts = [...this.selectedProducts];
    this.addedProducts.forEach(product => {
      this.quantityForm.addControl(
        String(product.id),
        new FormControl(1, [Validators.required, Validators.min(1)])
      );
    });

    this.uncheckAllProducts();
    dialog.close();
  }

  onFormSubmit(e: any) {
    e.preventDefault();
    console.log(this.quantityForm);
  }

  additionHandler(fornecedores: Fornecedor[], ref: NbDialogRef<any>) {
    this.fornecedores.push(...fornecedores);
    ref.close();
  }

  removerFornecedor(fornecedor: Fornecedor) {
    this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedor.id);
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
}
