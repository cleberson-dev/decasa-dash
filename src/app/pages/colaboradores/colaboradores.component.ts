import { Component, OnInit } from '@angular/core';
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
      summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/eva.png'
    },
    {
      id: 2,
      nome: 'Lee',
      summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/lee.png'
    },
    {
      id: 3,
      nome: 'Jack',
      summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/jack.png'
    },
    {
      id: 4,
      nome: 'Nick',
      summary: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt!',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis officiis voluptatibus veritatis nihil atque eveniet iste, explicabo vel incidunt! FINAL',
      foto: '/assets/images/nick.png'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
