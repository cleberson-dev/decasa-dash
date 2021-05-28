import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Colaborador } from '../../types';

@Component({
  selector: 'ngx-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.scss']
})
export class ColaboradoresComponent implements OnInit {
  colaboradores: Colaborador[] = [
    {
      id: 1,
      nome: 'Eva',
      resumo: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      descricao: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/eva.png'
    },
    {
      id: 2,
      nome: 'Lee',
      resumo: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      descricao: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/lee.png'
    },
    {
      id: 3,
      nome: 'Jack',
      resumo: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      descricao: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/jack.png'
    },
    {
      id: 4,
      nome: 'Nick',
      resumo: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      descricao: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/nick.png'
    },
  ];

  addColaboradorForm = this.fb.group({
    nome: ['', [Validators.required]],
    perfil: ['', [Validators.required]],
    senha: ['', [Validators.required]],
    confirmarSenha: ['', [Validators.required]]
  });

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  onSubmit(ref: NbDialogRef<any>) {
    console.log(this.addColaboradorForm);
    const pics = ['eva', 'jack', 'kate', 'lee', 'nick'];
    const id = this.colaboradores.slice(-1)[0].id + 1
    this.colaboradores.push({
      id,
      nome: this.addColaboradorForm.controls['nome'].value,
      resumo: this.addColaboradorForm.controls['descricao'].value,
      descricao: this.addColaboradorForm.controls['descricao'].value,
      foto: `/assets/images/` + pics[id % 5] + '.png'
    })
    this.addColaboradorForm.reset();
    ref.close();
  }

  samePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const senha = this.addColaboradorForm.controls['senha'].value;
    const senha2 = control.value; 
    
    if (senha !== senha2) return { samePassword: true };
    
    return null;
  }
}
