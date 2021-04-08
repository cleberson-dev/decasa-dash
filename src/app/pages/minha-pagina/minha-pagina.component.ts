import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LojistaService } from '../../lojista.service';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { CepService } from '../../cep.service';
import telefone from 'telefone';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ngx-minha-pagina',
  templateUrl: './minha-pagina.component.html',
  styleUrls: ['./minha-pagina.component.scss']
})
export class MinhaPaginaComponent implements OnInit {

  myForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(50)]],
    cnpj: ['', [Validators.required, this.cnpjValidator]],
    cpf: ['', [Validators.required, this.cpfValidator]],
    email: ['', [Validators.required, Validators.email]],
    cep: ['', [Validators.required, this.cepValidator]],
    municipio: [{ value: '', disabled: true }, [Validators.required]],
    logradouro: ['', [Validators.required, Validators.maxLength(50)]],
    numero: ['', [Validators.required, , Validators.maxLength(10)]],
    bairro: ['', [Validators.required, Validators.maxLength(50)]],
    celular: ['', [Validators.required, this.cellphoneNumberValidator]],
    telefone: ['', [this.phoneNumberValidator]],
    pontoReferencia: ['', [Validators.maxLength(50)]],
    sexo: ['', [Validators.required]],
    estadoCivil: ['', [Validators.required]],
    orgaoExpedidor: ['', [Validators.required]],
    // missing: uf_rg, representante
  });

  constructor(
    private lojistaService: LojistaService,
    private cepService: CepService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // this.lojistaService.get()
    //   .subscribe(lojistas => console.log(lojistas));
  }

  onFormSubmit() {
    const body = {
      nome: this.myForm.controls['nome'].value,
      cnpj: this.myForm.controls['cnpj'].value,
      logradouro: this.myForm.controls['logradouro'].value,
      numero: this.myForm.controls['numero'].value,
      bairro: this.myForm.controls['bairro'].value,
      pontoReferencia: this.myForm.controls['pontoReferencia'].value,
      celular: this.myForm.controls['celular'].value,
      telefone: this.myForm.controls['telefone'].value, 
      email: this.myForm.controls['email'].value,
      cep: this.myForm.controls['cep'].value,
      municipio: this.myForm.controls['municipio'].value,
      estadoCivil: {
        id: Number(this.myForm.controls['estadoCivil'].value)
      },
      sexo: {
        id: Number(this.myForm.controls['sexo'].value)
      },
      orgaoExpedidor: {
        id: Number(this.myForm.controls['orgaoExpedidor'].value)
      }
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