import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tab } from '../../../components/tabber/tabber.component';
import { Observable, of } from 'rxjs';
import { LojistasService } from '../../../services/lojistas.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ngx-alerta-compra',
  templateUrl: './alerta-compra.component.html',
  styleUrls: ['./alerta-compra.component.scss']
})
export class AlertaCompraComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedOptions$: Observable<string[]>;

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: false },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: true },
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

  codigoMask = /^\d+$/;

  lojas: Lojista[] = [];

  constructor(
    private fb: FormBuilder,
    private lojistaService: LojistasService,
  ) { }

  ngOnInit(): void {
    this.autoOptions = ['Produto #1', 'Produto #2', 'Produto #3'];
    this.suggestedOptions$ = of(this.autoOptions);

    this.lojistaService.todas
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

}
