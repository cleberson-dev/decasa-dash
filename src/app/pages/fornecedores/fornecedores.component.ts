import { Component, OnInit, TemplateRef } from '@angular/core';
import { ControlContainer, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiMunicipio, ApiService, ApiUF } from '../../services/api.service';
import { CepService } from '../../services/cep.service';
import * as CustomValidators from '../../validators';
import { Department } from '../produtos/solicitar/solicitar.component';

const defaultData = {
  bairro: 'Bairro #1',
  celular: '(99) 99999-9999',
  cep: '65284-000',
  cnpj: '123.123.123.123',
  email: 'email@decasa.com',
  logradouro: 'Rua 1º de Abril',
  numero: 123,
  pontoReferencia: 'Próximo a casa do lado',
  telefone: '(99) 99999-9999',
  cpfRepresentante: '123.123.123-12'
}

@Component({
  selector: 'ngx-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedoresComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  ufs: ApiUF[] = [];
  municipios: ApiMunicipio[] = [];
  departments: Department[] = [
    {
      id: 1,
      name: 'Departamento 1',
      categories: [
        { id: 1, name: 'Categoria 1' },
        { id: 2, name: 'Categoria 2' },
      ]
    },
    {
      id: 2,
      name: 'Departamento 2',
      categories: [
        { id: 3, name: 'Categoria 1' },
        { id: 4, name: 'Categoria 2' },
      ]
    },
  ];
  selectedDepartments: Department[] = [];
  
  formTitle = '';
  formSubmitText = '';
  formType = '';
  formFornecedor = this.fb.group({
    id: [''],
    nomeFantasia: ['', [Validators.required]],
    razaoSocial: ['', [Validators.required]],
    cnpj: ['', [Validators.required, CustomValidators.cnpj]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cep: ['', [Validators.required, CustomValidators.cep]],
    pontoReferencia: [''],
    celular: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    municipioEndereco: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    categorias: ['']
    // RG Representante, CPF Representante, Data RG
  });

  constructor(
    private dialogService: NbDialogService,
    private api: ApiService,
    private fb: FormBuilder,
    private cepService: CepService
  ) { }

  ngOnInit(): void {
    this.api.getFornecedores()
    .subscribe(fornecedores => {
      this.fornecedores = fornecedores;
    });

    this.api.getUfs()
      .subscribe(ufs => {
        this.ufs = ufs;
      });

    this.api.getDepartments()
      .subscribe(deps => {
        this.departments = deps;
      });
  }

  openCreate(dialog: TemplateRef<any>) {
    this.formTitle = 'Criar novo fornecedor';
    this.formSubmitText = 'Criar';
    this.formType = 'criar';
    this.formFornecedor.reset();
    this.dialogService.open(dialog, { context: { type: 'form' }});
  }

  openDetails(dialog: TemplateRef<any>, fornecedor: Fornecedor) {
    this.dialogService.open(dialog, { 
      context: { 
        type: 'detalhes',
        fornecedor
      }
    });
  }


  getCategoriesAndDepartments() {
    const flattenedCategories = this.selectedDepartments
      .map(dep => dep.categories.map(cat => cat.id))
      .reduce((acc, catId) => acc.concat(catId), []);
    
    // Categorias que pertencem a um departamento selecionado devem ser excluidas no envio do formulário
    const formCategories = (this.formFornecedor.controls['categorias'].value as number[])
      .filter(formCatId => flattenedCategories.every(catId => formCatId !== catId));

    return { 
      categoriasFornecidas: formCategories.map(catId => ({ id: catId })), 
      departamentosFornecidos: this.selectedDepartments.map(dep => ({ id: dep.id })), 
    };
  }


  handleFormSubmit(ref: NbDialogRef<any>) {
    const { categoriasFornecidas, departamentosFornecidos } = this.getCategoriesAndDepartments();
    
    const fornecedor: Fornecedor = {
      id: this.formFornecedor.controls['id'].value || undefined,
      cnpj: this.formFornecedor.controls['cnpj'].value,
      bairro: this.formFornecedor.controls['bairro'].value,
      celular: this.formFornecedor.controls['celular'].value,
      cep: this.formFornecedor.controls['cep'].value,
      email: this.formFornecedor.controls['email'].value,
      logradouro: this.formFornecedor.controls['logradouro'].value,
      numero: this.formFornecedor.controls['numero'].value,
      pontoReferencia: this.formFornecedor.controls['pontoReferencia'].value,
      telefone: this.formFornecedor.controls['telefone'].value,
      municipioEndereco: {
        id: Number(this.formFornecedor.controls['municipioEndereco'].value)
      },
      inscricaoEstadual: this.formFornecedor.controls['inscricaoEstadual'].value,
      ufRg: {
        id: this.formFornecedor.controls['uf'].value
      },
      nomeFantasia: this.formFornecedor.controls['nomeFantasia'].value,
      razaoSocial: this.formFornecedor.controls['razaoSocial'].value,
      categoriasFornecidas, departamentosFornecidos
    };
    
    console.log('Submitting this: ', fornecedor);

    if (this.formType === 'editar') {
      this.api.editFornecedor(fornecedor)
        .subscribe(() => {
          const editedFornecedorIdx = this.fornecedores.findIndex(f => f.id === fornecedor.id);
          this.fornecedores[editedFornecedorIdx] = fornecedor;
          this.resetForm();
          ref.close();
        });
    } else if (this.formType === 'criar') {
      this.api.criarFornecedor({ id: undefined, ...fornecedor })
        .subscribe(() => {
          this.fornecedores.push(fornecedor);
          this.resetForm();
          ref.close();
        });
    }
  }
  
  resetForm() {
    this.formFornecedor.patchValue({
      id: '',
      nomeFantasia: '',
      razaoSocial: '',
      cnpj: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cep: '',
      pontoReferencia: '',
      celular: '',
      telefone: '',
      email: '',
      municipioEndereco: '',
      inscricaoEstadual: '',
      categorias: []
    });
    this.selectedDepartments = [];
  }

  onEdit(context: { fornecedor: Fornecedor; type: string; }) {
    this.formTitle = 'Editar fornecedor';
    this.formSubmitText = 'Editar';
    this.formType = 'editar';
    this.formFornecedor.patchValue({
      id: context.fornecedor.id,
      nomeFantasia: context.fornecedor.nomeFantasia,
      razaoSocial: context.fornecedor.razaoSocial,
      cnpj: context.fornecedor.cnpj,
      logradouro: context.fornecedor.logradouro,
      numero: context.fornecedor.numero,
      bairro: context.fornecedor.bairro,
      cep: context.fornecedor.cep,
      pontoReferencia: context.fornecedor.pontoReferencia,
      celular: context.fornecedor.celular,
      telefone: context.fornecedor.telefone,
      email: context.fornecedor.email,
      municipioEndereco: context.fornecedor.municipioEndereco.id,
      inscricaoEstadual: context.fornecedor.inscricaoEstadual,
      categorias: context.fornecedor.categoriasFornecidas?.map(c => c.id) || []
    });
    context.type = 'form';
  }

  isControlInvalid(controlName: string) {
    return (
      this.formFornecedor.controls[controlName].invalid 
      && (
        this.formFornecedor.controls[controlName].touched 
        || this.formFornecedor.controls[controlName].dirty
      )
    );
  }

  getErrorMessage(controlName: string) {
    const [firstType] = Object
      .entries(this.formFornecedor.controls[controlName].errors)
      .filter(([_, val]) => !!val)
      .map(([key]) => key);

    const messages = {
      required: 'Campo Obrigatório -_-',
      cnpj: 'CNPJ Inválido',
      cpf: 'CPF Inválido'
    }

    const defaultMessage = 'Campo inválido *-*';

    return messages[firstType] || defaultMessage;
  }

  onBlock(fornecedorId: number, ref: NbDialogRef<any>) {
    this.api.removerFornecedor(fornecedorId)
      .subscribe(() => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedorId);
      });
    ref.close();
  }

  fillAddresses() {
    if (this.formFornecedor.controls['cep'].invalid) {
      this.formFornecedor.patchValue({
        logradouro: '',
        bairro: ''
      });
      return;
    }
    
    const cep = this.formFornecedor.controls['cep'].value;
    this.cepService.get(cep)
      .subscribe(data => {
        this.formFornecedor.patchValue({
          logradouro: data.logradouro,
          bairro: data.bairro
        });
      });
  }

  onUFChange(newUf: any) {
    if (newUf === '') return;
    this.api.getMunicipiosByUf(Number(newUf))
      .subscribe(municipios => {
        this.municipios = municipios;
      });
  }

  onInscricaoBlur() {
    console.log(this.formFornecedor);
  }

  handleDepClick(event: any, department: Department) {
    if (event.target.className !== "option-group-title") return;

    const control = this.formFornecedor.controls['categorias'];
    const categorias = Array.isArray(control.value) ? control.value : [];

    const depIdx = this.selectedDepartments.findIndex(selectedDep => selectedDep.id === department.id);

    // Must remove categories for a department already selected 
    if (depIdx !== -1) {
      const newCategorias = categorias.filter(catId => {
        return department.categories.every(depCat => catId !== depCat.id);
      });
      control.setValue(newCategorias);
      this.selectedDepartments.splice(depIdx, 1);
      return;
    }
    
    const newCategorias = [
      ...new Set([...categorias, ...department.categories.map(cat => cat.id)])
    ];
    control.setValue(newCategorias);
    this.selectedDepartments.push(department);
  }


  isDepartmentSelected(depId: number) {
    return this.selectedDepartments.some(dep => dep.id === depId);
  }
}
