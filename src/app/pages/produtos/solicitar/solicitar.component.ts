import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TreeItem } from '../../../components/tree/tree.component';
import { ApiService } from '../../../services/api.service';
import { AbstractControl } from '@angular/forms';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { CepService } from '../../../services/cep.service';
import telefone from 'telefone';  
import { ValidationErrors } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { ProdutosService } from '../../../services/produtos.service';

export type Department = {
  id: number;
  name: string;
  categories: { 
    id: number;
    name: string; 
  }[];
}

@Component({
  selector: 'ngx-solicitar',
  templateUrl: './solicitar.component.html',
  styleUrls: ['./solicitar.component.scss']
})
export class SolicitarComponent implements OnInit {
  codigoMask = /^\d+$/;

  myForm = this.fb.group({
    categoria: ['', [Validators.required]],
    unidadeMedida: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    quantidadeApresentacao: ['', [Validators.required]],
    detalhe: ['', [Validators.required]],
    manualInstrucao: ['', [Validators.required]],
    videoDemonstrativo: ['', [Validators.required]],
    cnp: ['', [Validators.required]],
    pesoGrama: ['', [Validators.required, Validators.min(0)]],
    altura: ['', [Validators.required, Validators.min(0)]],
    largura: ['', [Validators.required, Validators.min(0)]],
    profundidade: ['', [Validators.required, Validators.min(0)]]
  });

  departments: Department[] = [];
  departmentTree: TreeItem[] = [];

  unidadesMedida: UnidadeMedida[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private cepService: CepService,
    private toastrService: NbToastrService,
    private produtosService: ProdutosService,
  ) { }

  ngOnInit(): void {
    this.apiService.getUnidadesDeMedidas()
      .subscribe(
        unidadesMedida => {
          this.unidadesMedida = unidadesMedida;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter unidades de medida');
        }
      );
    
    this.apiService.getDepartments()
      .subscribe(
        departments => {
          this.departments = departments;

          this.departmentTree = this.departments.map(department => ({
            name: department.name,
            icon: 'bookmark',
            value: department.id + '',
            children: department.categories.map(cat => ({
              name: cat.name, value: cat.id + '', icon: 'folder-outline', active: false
            }))
          }));
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter departamentos');
        }   
      );
  }

  onFormSubmit() {
    const produto: Produto = {
      cnp: this.myForm.controls['cnp'].value,
      descricao: this.myForm.controls['descricao'].value,
      foto: '',
      produtoLiberado: false,
      modelo: {
        id: 1
      },
      categoria: {
        id: this.myForm.controls['categoria'].value
      },
      unidadeMedidaProduto: {
        id: this.myForm.controls['unidadeMedida'].value
      },
      quantidadeApresentacao: this.myForm.controls['quantidadeApresentacao'].value,
      detalhe: this.myForm.controls['detalhe'].value,
      manualInstrucao: this.myForm.controls['manualInstrucao'].value,
      videoDemonstrativo: this.myForm.controls['videoDemonstrativo'].value,
      pesoGrama: this.myForm.controls['pesoGrama'].value,
      alturaCm: this.myForm.controls['altura'].value,
      larguraCm: this.myForm.controls['largura'].value,
      profundidadeCm: this.myForm.controls['profundidade'].value
    }

    this.produtosService.criarProduto(produto)
      .subscribe(
        () => {
          alert('Criado!');
          this.myForm.reset();
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível solicitar novo produto');
        });
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


  onAddPhotos() {
    const fileInputEl = document.createElement("input");

    fileInputEl.type = "file";
    fileInputEl.accept = "image/*";
    fileInputEl.multiple = true;

    fileInputEl.addEventListener("change", (e: any) => {
      const formData = new FormData();
      
      const files = [...e.path[0].files];
      console.log(files);
      
      for (let file of files) {
        formData.append('fotos[]', file);
      }

      console.log(formData);
    });

    fileInputEl.dispatchEvent(new MouseEvent("click"));
  }
}
