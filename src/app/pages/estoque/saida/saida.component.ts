import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { Observable, of } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { LojistasService } from '../../../services/lojistas.service';

@Component({
  selector: 'ngx-saida',
  templateUrl: './saida.component.html',
  styleUrls: ['./saida.component.scss']
})
export class SaidaComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedOptions$: Observable<string[]>;

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

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private lojistasService: LojistasService,
  ) { }

  ngOnInit(): void {
    this.autoOptions = ['Produto #1', 'Produto #2', 'Produto #3'];
    this.suggestedOptions$ = of(this.autoOptions);
    this.lojistasService.todas
      .subscribe(lojas => {
        this.lojas = lojas;
      });
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

  get origens() {
    return this.lojas.filter(loja => loja.id !== this.headerForm.controls['destino'].value);
  }

  get destinos() {
    return this.lojas.filter(loja => loja.id !== this.headerForm.controls['origem'].value)
  }
}
