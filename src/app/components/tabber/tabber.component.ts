import { Component, Input, OnInit } from '@angular/core';

export type Tab = {
  title: string;
  link?: string;
  active?: boolean;
}

@Component({
  selector: 'ngx-tabber',
  templateUrl: './tabber.component.html',
  styleUrls: ['./tabber.component.scss']
})
export class TabberComponent implements OnInit {

  @Input() tabs: Tab[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
