import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { categorias, departamentos, marcas, modelos } from '../../../fake-data';
import { AddProductItem } from '../../../types';

@Component({
  selector: 'ngx-criar-pedidos',
  templateUrl: './criar-pedidos.component.html',
  styleUrls: ['./criar-pedidos.component.scss']
})
export class CriarPedidosComponent implements OnInit {
  produtos: AddProductItem[] = [
    {
      id: 1,
      nome: 'Produto #1',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 2,
      nome: 'Produto #2',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 3,
      nome: 'Produto #3',
      marca: marcas.amanco,
      modelo: modelos.modelo5,
      categoria: categorias.smartphones,
      departamento: departamentos.musica,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 4,
      nome: 'Produto #4',
      marca: marcas.fender,
      modelo: modelos.galaxy,
      categoria: categorias.sofas,
      departamento: departamentos.informatica,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    },
    {
      id: 5,
      nome: 'Produto #5',
      marca: marcas.nike,
      modelo: modelos.airMax,
      categoria: categorias.roupas,
      departamento: departamentos.moda,
      foto: 'https://media.benessereblog.it/5/57c/latte-e-formaggi.jpg'
    }
  ];

  addedProducts: AddProductItem[] = [];

  selectedCategory = '';

  quantityForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) { }

  get selectedProducts() {
    return this.produtos.filter(produto => produto.selected);
  }

  get filteredProducts() {
    return this.selectedCategory === "" ? this.produtos : this.produtos.filter(produto => String(produto.categoria.id) === String(this.selectedCategory))
  }

  uncheckAllProducts() {
    this.produtos.forEach(produto => {
      produto.selected = false;
    });
  }

  ngOnInit(): void {
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  handleProductDialog(dialog: NbDialogRef<any>) {
    this.addedProducts = this.produtos.filter(produto => produto.selected);
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
}
