import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiMunicipio, ApiUF } from '../../services/localizacao.service';
import { AuthService } from '../../services/auth.service';
import { LocalizacaoService } from '../../services/localizacao.service';
import { LojistasService } from '../../services/lojistas.service';
import * as CustomValidators from '../../validators';

type Company = {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  telefone: string;
}

type Loja = {
  nome: string;
  cnpj: string;
  inscricaoEstadual: string;
  codigo: string;
  endereco: string;
  telefone: string;
  gerente?: string;
}

@Component({
  selector: 'ngx-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  @ViewChild('autoInput') autoInput;
  
  addFilialForm = this.fb.group({
    razaoSocial: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    cpf: ['', [Validators.required, CustomValidators.cpf]],
    cnpj: ['', [Validators.required, CustomValidators.cnpj]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.min(8), Validators.max(16)]],
    senha2: ['', [Validators.required, Validators.min(8), Validators.max(16)]],
    cep: ['', [Validators.required, CustomValidators.cep]],
    logradouro: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    municipio: ['', [Validators.required]],
    pontoReferencia: ['', [Validators.required]],
    celular: ['', [Validators.required, CustomValidators.cellphone]],
    telefone: [''],
  });

  editInfoForm = this.fb.group({
    endereco: ['', [Validators.required]],
    telefone: ['', [Validators.required]]
  });

  loja: Company;
  filiais: (Lojista & { collapsed?: boolean; })[] = [];
  
  codigoMask = /^\d+$/;

  ufs: ApiUF[] = [];
  municipios: ApiMunicipio[] = [];
  municipiosSuggestions: string[] = [];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private authService: AuthService,
    private lojistasService: LojistasService,
    private localizacaoService: LocalizacaoService,
  ) { }

  ngOnInit(): void {
    this.lojistasService.atual
      .subscribe(
        lojista => {
          this.loja = {
            inscricaoEstadual: lojista.inscricaoEstadual,
            endereco: lojista.logradouro,
            telefone: lojista.telefone,
            cnpj: lojista.cnpj,
            nome: lojista.nome,
            razaoSocial: lojista.razaoSocial,
          };
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter lojista');
        }
      );

    if (this.authService.isMatriz) {
      this.lojistasService.filiais
        .subscribe(data => {
          this.filiais = data.content;
        });
    }

    this.localizacaoService.ufs
      .subscribe(
        (ufs) => {
          this.ufs = ufs;
        },
        (err) => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter UFs');
        }
      );
  }

  openAddLojaModal(dialog: TemplateRef<any>) {
    const context = { 
      type: 'add-filial'
    };

    this.dialogService.open(dialog, { context });
  }

  onAddLojaSubmit(dialog: NbDialogRef<any>) {
    const municipio = this.municipios.find(mun => mun.nome.toLowerCase() === String(this.addFilialForm.controls['municipio'].value).toLowerCase());
    if (!municipio) {
      this.toastrService.danger('Município Inválido', 'Impossível adicionar filial');
      return;
    }

    const lojista: RegistrarLojistaParams = {
      razaoSocial: String(this.addFilialForm.controls['razaoSocial'].value),
      nome: String(this.addFilialForm.controls['nome'].value),
      cnpj: String(this.addFilialForm.controls['cnpj'].value),
      cpf: String(this.addFilialForm.controls['cpf'].value),
      inscricaoEstadual: String(this.addFilialForm.controls['inscricaoEstadual'].value),
      email: String(this.addFilialForm.controls['email'].value),
      senha: String(this.addFilialForm.controls['senha'].value),
      cep: String(this.addFilialForm.controls['cep'].value),
      logradouro: String(this.addFilialForm.controls['logradouro'].value),
      bairro: String(this.addFilialForm.controls['bairro'].value),
      ufRg: { id: Number(this.addFilialForm.controls['uf'].value) },
      municipio: { id: municipio.id },
      pontoReferencia: String(this.addFilialForm.controls['pontoReferencia'].value),
      celular: String(this.addFilialForm.controls['celular'].value),
      telefone: String(this.addFilialForm.controls['telefone'].value),
      perfil: { id: 1 },
    };
    
    this.lojistasService
      .criarFilial(lojista)
      .subscribe(
        novaFilial => {
          this.filiais.push(novaFilial);
          dialog.close();
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error?.message || "Sem mensagem", 'Impossível criar filial');
          // dialog.close();
        }
      );

  }

  onAddLojaClose(ref: NbDialogRef<any>) {
    this.addFilialForm.reset();
    ref.close();
  }

  openEditInfoModal(dialog: TemplateRef<any>) {
    const context = {
      type: 'edit-info'
    };

    this.editInfoForm.patchValue({
      endereco: this.loja.endereco,
      telefone: this.loja.telefone 
    });

    this.dialogService.open(dialog, { context });
  }

  onEditInfoClose(ref: NbDialogRef<any>) {
    ref.close();
  }

  onEditInfoSubmit(dialog: NbDialogRef<any>) {
    this.loja = {
      ...this.loja,
      endereco: this.editInfoForm.controls['endereco'].value,
      telefone: this.editInfoForm.controls['telefone'].value,
    };

    dialog.close();
  }

  isMatriz(): boolean {
    return this.authService.isMatriz;
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

  onUFChange(uf: any) {
    this.addFilialForm.controls['municipio'].setValue('');
    document.documentElement.style.cursor = "wait";
    this.localizacaoService.municipiosPorUf(Number(uf))
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
    const control = this.addFilialForm.controls['cep'];
    
    if (control.value === '') {
      this.addFilialForm.patchValue({
        logradouro: '', bairro: '', uf: ''
      });
      this.municipios = [];
      return;
    };
    if (control.invalid) return;

    this.addFilialForm.controls['municipio'].setValue('');

    this.localizacaoService.informacaoCep(String(control.value))
      .subscribe(
        data => {
          const uf = this.ufs.find(uf => uf.sigla.toUpperCase() === data.uf.toUpperCase());
          
          this.addFilialForm.patchValue({
            uf: uf.id,
            logradouro: data.logradouro,
            bairro: data.bairro,
            pontoReferencia: data.complemento,
          });

          this.localizacaoService.municipiosPorUf(uf.id)
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
}
