import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { of } from 'rxjs';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LojistasService } from '../../../services/lojistas.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { delay } from 'rxjs/operators';
import { ProdutosService } from '../../../services/produtos.service';

@Component({
  selector: 'ngx-saida',
  templateUrl: './saida.component.html',
  styleUrls: ['./saida.component.scss'],
  animations: [
    trigger('rotate', [
      state('normal', style({
        transform: 'rotate(0deg)'
      })),
      state('torn', style({
        transform: 'rotate(180deg)'
      })),
      transition('normal => torn', [animate('0.3s 0s ease-out')]),
    ]),
  ],
})
export class SaidaComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedProdutos: string[] = [];
  produtos: Produto[] = [];

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: false },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: true },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Tombamento', link: '/estoque/tombamento', active: false },
  ];

  data = [
    // { codigo: '00001', nome: 'Produto #1', unidade: 'cm', quantidade: 1 },
  ];

  form = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    quantidade: ['', [Validators.required]]
  });

  headerForm = this.fb.group({
    origem: ['', [Validators.required]],
    destino: ['', [Validators.required]],
    motivo: ['']
  });

  saidaForm = this.fb.group({
    notaFiscal: ['']
  });

  codigoMask = /^\d+$/;

  lojas: Lojista[] = [];

  isTorn = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private lojistasService: LojistasService,
    private produtosService: ProdutosService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
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

  onNomeSelectionChange(event: string) {

  }

  onNomeInputBlur() {

  }

  onProdutoAdd() {

  }

  isInvalidControl(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  onConfirmBtnClick(dialog: TemplateRef<any>) {
    if (this.saidaForm.controls['notaFiscal'].value === '') {
      const context = {
        type: 'confirm-nfe'
      };
      this.dialogService.open(dialog, { context });
      return;
    }

    alert('Confirmado');
  }

  flipStores() {
    if (this.isTorn) return;

    const novoOrigem = this.headerForm.controls['destino'].value;
    const novoDestino = this.headerForm.controls['origem'].value;
    
    this.headerForm.patchValue({ origem: novoOrigem, destino: novoDestino });
    
    this.toggleRotation();
    of(null).pipe(delay(300)).subscribe(() => this.toggleRotation());
  }

  isOrigemDisabled(lojaID: number) {
    return this.headerForm.controls['destino'].value === lojaID;
  }

  isDestinoDisabled(lojaID: number) {
    return this.headerForm.controls['origem'].value === lojaID;
  }

  get rotationState() {
    return this.isTorn ? 'torn' : 'normal';
  }

  toggleRotation() {
    this.isTorn = !this.isTorn;
  }

  get isFlipDisabled() {
    const { origem, destino } = this.headerForm.value;

    return !origem || !destino;
  }
}
