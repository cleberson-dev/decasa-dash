import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { CepService } from '../../services/cep.service';
import telefone from 'telefone';  
import { ValidationErrors } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TreeItem } from '../../components/tree/tree.component';

export type Department = {
  id: number;
  name: string;
  categories: { 
    id: number;
    name: string; 
  }[];
}

@Component({
  selector: 'decasa-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosPageComponent implements OnInit {
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

  tabs = {
    meusProdutos: true,
    solicitar: false
  }

  departments: Department[] = [];
  departmentTree: TreeItem[] = [
    { 
      name: 'Celulares', 
      value: "1", 
      icon: 'bookmark', 
      children: [
        { name: 'Smartphones', value: "1", icon: 'folder-outline' },
        { name: 'Tablets', value: "2", icon: 'folder-outline' },
        { name: 'Telefones Fixos', value: "3", icon: 'folder-outline' },
      ]
    },
    { 
      name: 'Informática', 
      value: "2", 
      icon: 'bookmark', 
      children: [
        { name: 'Notebooks', value: "4", icon: 'folder-outline' },
        { name: 'Computadores All-in-One', value: "5", icon: 'folder-outline' },
        { name: 'Workstations', value: "6", icon: 'folder-outline' },
      ]
    },
    { 
      name: 'Moda', 
      value: "3", 
      icon: 'bookmark', 
      children: [
        { name: 'Roupas', value: "7", icon: 'folder-outline' },
        { name: 'Calçados', value: "8", icon: 'folder-outline' },
        { name: 'Acessórios', value: "9", icon: 'folder-outline' },
        { name: 'Relógios', value: "10", icon: 'folder-outline' },
      ]
    },
    { 
      name: 'Eletrodomésticos', 
      value: "4", 
      icon: 'bookmark', 
      children: [
        { name: 'Geladeiras', value: "11", icon: 'folder-outline' },
        { name: 'Fogões', value: "12", icon: 'folder-outline' },
      ]
    },
    { 
      name: 'Móveis', 
      value: "5", 
      icon: 'bookmark', 
      children: [
        { name: 'Sofás', value: "13", icon: 'folder-outline' }
      ]
    },
  ];

  ngOnInit() {
    this.apiService.getCategories()
      .subscribe((data: any) => {
        data.content.forEach(categoria => {
          const cur = this.departments.find(d => d.id === categoria.departamento.id);
          if (cur) {
            cur.categories.push({ id: categoria.id, name: categoria.descricao });
          } else {
            this.departments.push({
              id: categoria.departamento.id,
              name: categoria.departamento.descricao,
              categories: [{ id: categoria.id, name: categoria.descricao }]
            });
          }
        });

        this.departmentTree = this.departments.map(department => ({
          name: department.name,
          icon: 'bookmark',
          value: department.id + '',
          children: department.categories.map(cat => ({
            name: cat.name, value: cat.id + '', icon: 'folder-outline', active: false
          }))
        }));
      });
  }
  
  constructor(
    private cepService: CepService,
    private fb: FormBuilder,
    private apiService: ApiService
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

  changeTab(name: string) {
    this.tabs = {
      meusProdutos: name === 'meusProdutos',
      solicitar: name === 'solicitar'
    }
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