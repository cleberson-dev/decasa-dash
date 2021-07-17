import { Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbSelectComponent, NbToastrService } from '@nebular/theme';
import { ApiMunicipio, ApiService, ApiUF } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CepService } from '../../services/cep.service';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'ngx-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit {
  @ViewChild('autoInput') autoInput;
  
  registerForm = this.fb.group({
    razaoSocial: ['', [Validators.required]],
    nomeFantasia: ['', [Validators.required]],
    cnpj: ['', [Validators.required, CustomValidators.cnpj]],
    // rg: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
    senha2: ['', [Validators.required]],
    celular: ['', [Validators.required, CustomValidators.cellphone]],
    telefone: [''],
    uf: ['', [Validators.required]],
    municipio: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    pontoReferencia: ['', [Validators.required]],
    cep: ['', [Validators.required, CustomValidators.cep]],
    cpf: ['', [Validators.required, CustomValidators.cpf]],
  }, { validators: this.checarSenhas });

  ufs: ApiUF[] = [];
  municipios: ApiMunicipio[] = [];
  municipiosSuggestions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cepService: CepService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.apiService.getUfs()
      .subscribe(
        ufs => {
          this.ufs = ufs;
        },
        (err) => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter UFs');
        }
      );
  }

  onRegisterFormSubmit() {
    const body = {
      razaoSocial: String(this.registerForm.controls['razaoSocial'].value),
      nome: String(this.registerForm.controls['nomeFantasia'].value),
      cnpj: String(this.registerForm.controls['cnpj'].value),
      inscricaoEstadual: String(this.registerForm.controls['inscricaoEstadual'].value),
      email: String(this.registerForm.controls['email'].value),
      senha: String(this.registerForm.controls['senha'].value),
      cep: String(this.registerForm.controls['cep'].value),
      logradouro: String(this.registerForm.controls['logradouro'].value),
      bairro: String(this.registerForm.controls['bairro'].value),
      ufRg: { id: Number(this.registerForm.controls['uf'].value) },
      municipio: { 
        id: this.municipios.find(mun => mun.nome.toLowerCase() === String(this.registerForm.controls['municipio'].value).toLowerCase()).id 
      },
      pontoReferencia: String(this.registerForm.controls['pontoReferencia'].value),
      cpf: String(this.registerForm.controls['cpf'].value),
      celular: String(this.registerForm.controls['celular'].value),
      telefone: String(this.registerForm.controls['telefone'].value),
      perfil: { id: 1 },
      // rg: String(this.registerForm.controls['rg'].value),
      // idPerfil: Number(this.registerForm.controls['idPerfil'].value),
    };

    console.log('Enviando', body);
    
    this.authService
      .registrar(body)
      .subscribe(
        lojista => {
          this.authService.save(lojista);
          this.router.navigate(['/inicio']);
          this.toastrService.success('Registrado com sucesso!');
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível registrar lojista')
        }
      );
  }

  checarSenhas(group: FormGroup) {
    const senha = group.controls['senha'].value;
    const senha2 = group.controls['senha2'].value;

    return senha === senha2 ? null : { notSamePassword: true };
  }

  getErrorMessage(controlName: string) {
    if (controlName === 'senha2' && this.registerForm.errors?.notSamePassword) {
      return 'Senhas não batem';
    }
    
    const control = this.registerForm.controls[controlName];

    if (control.invalid  && (control.touched || control.dirty)) {
      const [error] = Object.keys(control.errors);

      const messages: Record<string, string> = {
        required: 'Campo obrigatório'
      };
  
      return messages[error] || 'Campo inválido';
    }
    
    return ' ';
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.controls[controlName];
    
    if (controlName === 'senha2' && this.registerForm.errors?.notSamePassword && (control.touched || control.dirty)) {
      return true;
    }

    return control.invalid && (control.touched || control.dirty);
  }

  onUFChange(uf: any) {
    this.registerForm.controls['municipio'].setValue('');
    document.documentElement.style.cursor = "wait";
    this.apiService.getMunicipiosByUf(Number(uf))
      .subscribe(
        municipios => {
          this.municipios = municipios;
          this.municipiosSuggestions = municipios.map(m => m.nome);
          this.autoInput.nativeElement.focus();
        },
        (err) => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter municípios por UF');
        },
        () => {
          document.documentElement.style.cursor = "default";
        }
      );
  }

  fillAddresses() {
    const control = this.registerForm.controls['cep'];
    
    if (control.value === '') {
      this.registerForm.patchValue({
        logradouro: '', bairro: '', uf: ''
      });
      this.municipios = [];
      return;
    };
    if (control.invalid) return;

    this.registerForm.controls['municipio'].setValue('');

    this.cepService.get(String(control.value))
      .subscribe(
        data => {
          const uf = this.ufs.find(uf => uf.sigla.toLocaleUpperCase() === data.uf.toUpperCase());
          
          this.registerForm.patchValue({
            uf: uf.id,
            logradouro: data.logradouro,
            bairro: data.bairro,
            pontoReferencia: data.complemento,
          });

          this.apiService.getMunicipiosByUf(uf.id)
            .subscribe(
              municipios => {
                this.municipios = municipios;
                this.municipiosSuggestions = municipios.map(m => m.nome);
              },
              err => {
                console.error(err);
                this.toastrService.danger(err.error.message, 'Impossível obter municípios por UF via CEP');
              }
            )
        },
        (err) => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter cep');
        }
      );
  }

  onMunicipioInputChange() {
    const { value } = this.autoInput.nativeElement;

    this.municipiosSuggestions = this.municipios
      .map(m => m.nome)
      .filter(municipio => municipio.toLowerCase().includes(value.toLowerCase()));
  }

  onSelectionChange(text: string) {
    this.municipiosSuggestions = this.municipios
      .map(m => m.nome)
      .filter(municipio => municipio.toLowerCase().includes(text.toLowerCase()));
  }
}
