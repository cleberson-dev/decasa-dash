import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { CepService } from '../../cep.service';
import telefone from 'telefone';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'decasa-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosPageComponent {
  myForm = this.fb.group({
    categoria: ['', [Validators.required]],
    unidadeMedida: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    quantidadeApresentacao: ['', [Validators.required]],
    detalhe: ['', [Validators.required]],
    manualInstrucao: ['', [Validators.required]],
    videoDemonstrativo: ['', [Validators.required, ]],
    cnp: ['', [Validators.required,]],
    pesoGrama: ['', [Validators.required]],
    altura: ['', [Validators.required]],
    largura: ['', [Validators.required]],
    profundidade: ['', [Validators.required]]
  });
  
  constructor(
    private cepService: CepService,
    private fb: FormBuilder,
  ) {}

  onFormSubmit() {
    const body = {
      categoria: this.myForm.controls['categoria'].value,
      unidadeMedida: this.myForm.controls['unidadeMedida'].value,
      descricao: this.myForm.controls['descricao'].value ,
      quantidadeApresentacao: this.myForm.controls['quantidadeApresentacao'].value,
      detalhe: this.myForm.controls['detalhe'].value,
      manualInstrucao: this.myForm.controls['manualInstrucao'].value,
      videoDemonstrativo: this.myForm.controls['videoDemonstrativo'].value,
      cnp: this.myForm.controls['cnp'].value,
      pesoGrama: this.myForm.controls['pesoGrama'].value,
      altura: this.myForm.controls['altura'].value,
      largura: this.myForm.controls['largura'].value,
      profundidade: this.myForm.controls['profundidade'].value
    }

    console.log(body);
  }


  cepValidator(control: AbstractControl): ValidationErrors | null {
    const cep = control.value + '';

    const validatingExp = /\d{5}-\d{3}/;
    if (!cep.match(validatingExp)) return { cep: true };
    return null;
  }

  cellphoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const isValid = Boolean(telefone.parse(control.value, { apenasCelular: true }));

    if (!isValid) return { cellphoneNumber: true };
    return null;
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value == '') return null;

    const isValid = Boolean(telefone.parse(control.value, { apenasFixo: true }));

    if (!isValid) return { phoneNumber: true };

    return null;
  }

  cnpjValidator(control: AbstractControl): ValidationErrors | null {
    if (!cnpj.isValid(control.value)) return { cnpj: true };
    return null;
  }

  cpfValidator(control: AbstractControl): ValidationErrors | null {
    if (!cpf.isValid(control.value)) return { cpf: true };
    return null;
  }

  isInvalidControl(name: string): boolean {
    return this.myForm.controls[name].invalid && (this.myForm.controls[name].touched || this.myForm.controls[name].dirty);
  }

  onFocusOut() {
    if (this.isInvalidControl('cep')) {
      this.myForm.patchValue({ 
        municipio: '', logradouro: '', bairro: '' 
      });
      return;
    }

    const cep = this.myForm.controls['cep'].value;
    this.cepService.get(cep)
      .subscribe(({ localidade: municipio, logradouro, bairro }: any) => {
        this.myForm.patchValue({ 
          municipio, logradouro, bairro 
        });
      });
  }

  getErrorMessage(name: string): string {
    const messages = {
      required: 'Campo obrigatório',
      cnpj: 'CNPJ Inválido',
      cpf: 'CPF Incorreto',
      cellphoneNumber: 'Número de Celular incorreto',
      phone: 'Número de Telefone incorreto',
      cep: 'CEP Inválido'
    }

    const [firstErrorOccurrence] = Object.keys(
      this.myForm.controls[name].errors
    );

    return messages[firstErrorOccurrence] || 'Campo Inválido';
  }
}