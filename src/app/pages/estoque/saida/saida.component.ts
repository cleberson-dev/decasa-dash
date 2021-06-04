import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { Observable, of } from 'rxjs';
import { NbDialogService } from '@nebular/theme';

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
    { codigo: '00001', nome: 'Produto #1', unidade: 'cm', quantidade: 1 },
    { codigo: '00002', nome: 'Produto #2', unidade: 'caixa', quantidade: 3 }
  ];

  form = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    quantidade: ['', [Validators.required]]
  });

  saidaForm = this.fb.group({
    notaFiscal: ['']
  });

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.autoOptions = ['Produto #1', 'Produto #2', 'Produto #3'];
    this.suggestedOptions$ = of(this.autoOptions);
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
    console.log('btn clicked');
    if (this.saidaForm.controls['notaFiscal'].value === '') {
      const context = {
        type: 'confirm-nfe'
      };
      this.dialogService.open(dialog, { context });
      return;
    }

    alert('Confirmado');
  }
}
