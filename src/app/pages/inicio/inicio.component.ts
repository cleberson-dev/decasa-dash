import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiMunicipio, ApiService, ApiUF, RegistrarLojistaParams } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CepService } from '../../services/cep.service';

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
    cpf: ['', [Validators.required]],
    cnpj: ['', [Validators.required]],
    email: ['', [Validators.required]],
    senha: ['', [Validators.required]],
    senha2: ['', [Validators.required]],
    cep: ['', [Validators.required]],
    logradouro: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    municipio: ['', [Validators.required]],
    pontoReferencia: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
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
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private authService: AuthService,
    private cepService: CepService,
  ) { }

  ngOnInit(): void {
    this.apiService.getLojista(this.authService.lojista.id)
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
      this.apiService.getFiliais(this.authService.lojista.id)
        .subscribe(data => {
          console.log(data);
          this.filiais = data.content;
        });
    }

    this.apiService.getUfs()
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
    const matrizId = this.authService.lojista.id;
    
    console.log('Filial', lojista);
    console.log('Matriz de id', matrizId);
    this.apiService
      .criarFilial(matrizId, lojista)
      .subscribe(
        novaFilial => {
          console.log(novaFilial);
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
    this.apiService.getMunicipiosByUf(Number(uf))
      .subscribe(
        municipios => {
          this.municipios = municipios;
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

    this.cepService.get(String(control.value))
      .subscribe(
        data => {
          const uf = this.ufs.find(uf => uf.sigla.toUpperCase() === data.uf.toUpperCase());
          
          this.addFilialForm.patchValue({
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
}
