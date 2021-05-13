import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tab } from '../../components/tabber/tabber.component';
import { Fornecedor } from '../../types';

type Pedido = {
  data: string;
  codigo: string;
}

type PedidoProduto = {
  codigo: string;
  nome: string;
  unidade: string;
  quantidade: number;
}

@Component({
  selector: 'ngx-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedOptions$: Observable<string[]>;

  tabs: Tab[] = [
    { title: 'Cotação', link: '', active: true },
    { title: 'Mapa', link: '' },
    { title: 'Emitir compra', link: '' },
    { title: 'Acompanhamento', link: '' },
  ]

  rows: PedidoProduto[] = [
    { codigo: '000001', nome: 'Produto #1', unidade: 'pacote', quantidade: 1 },
    { codigo: '000002', nome: 'Produto #2', unidade: 'caixa', quantidade: 1 },
  ]

  novoPedidoForm = this.fb.group({
    rcm: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    quantidade: [1, [Validators.required, Validators.min(1)]],
  });

  fornecedores: Fornecedor[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit(): void {
    this.autoOptions = ['Option 1', 'Option 2', 'Option 3'];
    this.suggestedOptions$ = of(this.autoOptions);
  }

  onSelectionChange($event: string) {
    this.suggestedOptions$ = of($event).pipe(
      map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    );
  }

  onInputChange() {
    const { value } = this.input.nativeElement;
    this.suggestedOptions$ = of(value).pipe(
      map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    );
  }

  onPedidoAdd() {
    this.rows.unshift({
      codigo: this.novoPedidoForm.controls['rcm'].value,
      nome: this.novoPedidoForm.controls['nome'].value,
      quantidade: this.novoPedidoForm.controls['quantidade'].value,
      unidade: this.novoPedidoForm.controls['unidade'].value,
    });
    this.novoPedidoForm.reset();
    this.input.nativeElement.value = "";
  }

  openAddFornecedores(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  handleFornecedores(fornecedores: Fornecedor[], ref: NbDialogRef<any>) {
    this.fornecedores.push(...fornecedores);
    ref.close();
  }
}
