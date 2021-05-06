import { Component, Input, OnInit } from '@angular/core';

type Column = {
  id: number;
  title: string;
}

@Component({
  selector: 'ngx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: Column[];
  @Input() data: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
