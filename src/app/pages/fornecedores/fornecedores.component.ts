import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { ApiMunicipio, ApiUF } from '../../services/localizacao.service';
import { FornecedoresService } from '../../services/fornecedores.service';
import { LocalizacaoService } from '../../services/localizacao.service';
import * as CustomValidators from '../../validators';
import { Department } from '../produtos/solicitar/solicitar.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'ngx-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedoresComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  ufs: ApiUF[] = [];
  municipios: ApiMunicipio[] = [];
  departments: Department[] = [];
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
    email: ['', [Validators.required, CustomValidators.email]],
    municipioEndereco: ['', [Validators.required]],
    inscricaoEstadual: ['', [Validators.required]],
    uf: ['', [Validators.required]],
    categorias: ['']
    // RG Representante, CPF Representante, Data RG
  });

  loadingFornecedores = true;

  removeBtnLoading: boolean = false;
  editBtnLoading: boolean = false;

  constructor(
    private dialogService: NbDialogService,
    private api: ApiService,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private fornecedoresService: FornecedoresService,
    private localizacaoService: LocalizacaoService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.show("fornecedores-spinner");
    this.fornecedoresService.todos()
    .subscribe(
      data => {
        this.fornecedores = data;
        
        this.spinner.hide("fornecedores-spinner");
        this.loadingFornecedores = false;
      },
      err => {
        console.error(err);
        this.toastrService.danger(err.error.message, 'Imposs??vel obter fornecedores');
        
        this.spinner.hide("fornecedores-spinner");
        this.loadingFornecedores = false;
      }
    );

    this.localizacaoService.ufs
      .subscribe(
        ufs => {
          this.ufs = ufs;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Imposs??vel obter UFs');
        }
      );

    this.api.getDepartments()
      .subscribe(
        deps => {
          this.departments = deps;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Imposs??vel obter departamentos');
        }
      );
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
    
    // Categorias que pertencem a um departamento selecionado devem ser excluidas no envio do formul??rio
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
    
    if (this.formType === 'editar') {
      this.fornecedoresService.editar(fornecedor)
        .subscribe(
          () => {
            const editedFornecedorIdx = this.fornecedores.findIndex(f => f.id === fornecedor.id);
            this.fornecedores[editedFornecedorIdx] = fornecedor;
            this.resetForm();
            ref.close();
          }, 
          ({ error }) => {
            console.error(error);
            this.toastrService.danger(error.titulo, 'Imposs??vel editar fornecedor');
          } 
          );
        } else if (this.formType === 'criar') {
          this.fornecedoresService.criar({ id: undefined, ...fornecedor })
          .subscribe(
            () => {
              this.fornecedores.push(fornecedor);
              this.resetForm();
              ref.close();
            },
            (err) => {
              console.error(err);
              if (err.status === 500) this.toastrService.danger(err.error.message, 'Imposs??vel criar fornecedor');
              this.toastrService.danger(err.error.titulo, 'Imposs??vel criar fornecedor');
            }
        );
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
    this.editBtnLoading = true;
    
    this.localizacaoService.municipiosPorUf(context.fornecedor.ufRg.id)
    .subscribe(
      municipios => {
        this.municipios = municipios;
        
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
          categorias: context.fornecedor.categoriasFornecidas?.map(c => c.id) || [],
          uf: context.fornecedor.ufRg.id
        });
        this.editBtnLoading = false;
        context.type = 'form';
      },
      err => {
        this.editBtnLoading = false;
        console.error(err);
        this.toastrService.danger(err.error.message, 'Imposs??vel obter munic??pios por UF');
      }
    );

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
      required: 'Campo Obrigat??rio -_-',
      cnpj: 'CNPJ Inv??lido',
      cpf: 'CPF Inv??lido'
    }

    const defaultMessage = 'Campo inv??lido *-*';

    return messages[firstType] || defaultMessage;
  }

  onBlock(fornecedorID: number, ref: NbDialogRef<any>) {
    this.removeBtnLoading = true;
    this.fornecedoresService.remover(fornecedorID)
      .subscribe(
        () => {
          this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedorID);
          ref.close();
          this.removeBtnLoading = false;
        },
        (err) => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Imposs??vel remover fornecedor');
          this.removeBtnLoading = false;
        }
      );
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
    this.localizacaoService.informacaoCep(cep)
      .subscribe(
        data => {
          this.formFornecedor.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro
          });
        },
        err => {
          console.error(err);
          if (err.status === 500) this.toastrService.danger(err.error.message, 'Imposs??vel obter cep');
        }
      );
  }

  onUFChange(newUf: any) {
    if (newUf === '') return;
    this.localizacaoService.municipiosPorUf(Number(newUf))
      .subscribe(
        municipios => {
          this.municipios = municipios;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Imposs??vel obter munic??pios por UF');
        }
      );
  }

  onInscricaoBlur() {
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

  onFormBackBtn(context: any, ref: NbDialogRef<any>) {
    if (this.formType === "editar") {
      context.type = "detalhes";
      return;
    }

    ref.close();
  }
}
