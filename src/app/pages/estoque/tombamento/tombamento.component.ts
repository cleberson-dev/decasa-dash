import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { Observable, of } from 'rxjs';

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
    { codigo: '00001', nome: 'Produto #1', unidade: 'cm', qtVirtual: 1, conferido: 1 },
    { codigo: '00002', nome: 'Produto #2', unidade: 'caixa', qtVirtual: 3, conferido: 2 }
  ];

  form = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    qtVirtual: ['', [Validators.required]],
    conferido: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder
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
}
