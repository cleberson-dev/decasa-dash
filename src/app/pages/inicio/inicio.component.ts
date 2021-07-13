import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

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
  gerente: string;
}

@Component({
  selector: 'ngx-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  addLojaForm = this.fb.group({
    nome: ['', [Validators.required]],
    cnpj: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    gerente: ['', [Validators.required]],
  });

  editInfoForm = this.fb.group({
    endereco: ['', [Validators.required]],
    telefone: ['', [Validators.required]]
  });

  loja: Company;

  lojas: (Loja & { collapsed?: boolean; })[] = [
    { 
      nome: 'Loja 01', 
      cnpj: '99.999.999/9999-99',
      codigo: 'Codigo 01',
      endereco: 'Endereço 01',
      gerente: 'Gerente 01',
      inscricaoEstadual: '9999999',
      telefone: '(99) 99999-9999',
    },
    { 
      nome: 'Loja 02', 
      cnpj: '88.888.888/8888-88',
      codigo: 'Codigo 02',
      endereco: 'Endereço 02',
      gerente: 'Gerente 02',
      inscricaoEstadual: '8888888',
      telefone: '(88) 88888-8888',
    },
  ];
  
  codigoMask = /^\d+$/;

  filiais: (Lojista & { collapsed?: boolean; })[] = [];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private authService: AuthService,
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
          this.filiais = data.content;
        });
    }
  }

  openAddLojaModal(dialog: TemplateRef<any>) {
    const context = { 
      type: 'add-loja'
    };

    this.dialogService.open(dialog, { context });
  }

  onAddLojaSubmit(dialog: NbDialogRef<any>) {
    const loja: Loja = {
      nome: this.addLojaForm.controls['nome'].value,
      cnpj: this.addLojaForm.controls['cnpj'].value,
      codigo: this.addLojaForm.controls['codigo'].value,
      endereco: this.addLojaForm.controls['endereco'].value,
      inscricaoEstadual: this.addLojaForm.controls['inscricaoEstadual'].value,
      gerente: this.addLojaForm.controls['gerente'].value,
      telefone: this.addLojaForm.controls['telefone'].value
    };
    this.lojas.push(loja);

    dialog.close();
  }

  onAddLojaClose(ref: NbDialogRef<any>) {
    this.addLojaForm.reset();
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
}
