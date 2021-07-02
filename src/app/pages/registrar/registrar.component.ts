import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'ngx-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {
  
  registerForm = this.fb.group({
    razaoSocial: ['', [Validators.required]],
    cnpj: ['', [Validators.required, CustomValidators.cnpj]],
    rg: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
    senha2: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    celular: ['', [Validators.required, CustomValidators.cellphone]],
    telefone: ['', [Validators.required, CustomValidators.phone]],
  }, { validators: this.checarSenhas });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onRegisterFormSubmit() {

  }

  checarSenhas(group: FormGroup) {
    const senha = group.controls['senha'].value;
    const senha2 = group.controls['senha2'].value;

    return senha === senha2 ? null : { notSamePassword: true };
  }
}
