import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { Observable, of } from 'rxjs';
import { LojistasService } from '../../../services/lojistas.service';
import { ProdutosService } from '../../../services/produtos.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-tombamento',
  templateUrl: './tombamento.component.html',
  styleUrls: ['./tombamento.component.scss']
})
export class TombamentoComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedOptions$: Observable<string[]>;

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: false },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Tombamento', link: '/estoque/tombamento', active: true },
  ];

  data = [
    // { codigo: '00001', nome: 'Produto #1', unidade: 'cm', qtVirtual: 1, conferido: 1 },
  ];

  form = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    qtVirtual: ['', [Validators.required]],
    conferido: ['', [Validators.required]],
  });

  codigoMask = /^\d+$/;

  lojas: Lojista[] = [];
  produtos: Produto[] = [];
  suggestedProdutos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private lojistasService: LojistasService,
    private produtosService: ProdutosService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.autoOptions = ['Produto #1', 'Produto #2', 'Produto #3'];
    this.suggestedOptions$ = of(this.autoOptions);

    this.lojistasService.todas
      .subscribe(lojas => {
        this.lojas = lojas;
      });

    this.produtosService.getProdutosEmEstoque({ page: 1, size: 5 })
      .subscribe(
        (data) => {
          this.produtos = data.content;
          this.suggestedProdutos = this.produtos.map(produto => produto.descricao);
        },
        (err) => {
          this.toastrService.danger(err.error.message, 'Impossível obter produtos em estoque');
        }
      );
  }

  onCodigoBlur() {

  }

  onNomeInputChange() {

  }

  onProdutoSelectionChange(event: string) {
    const produto = this.produtos.find(produto => produto.descricao.toLowerCase().includes(event.toLowerCase()))
    
    this.form.patchValue({
      codigo: produto.cnp,
      unidade: produto.unidadeMedidaProduto.sigla,
      qtVirtual: 1,
      conferido: 0
    });
  }

  onNomeInputBlur() {

  }

  onProdutoAdd() {

  }

  isInvalidControl(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  printBtnClickHandler() {
    window.print();
  }
}
