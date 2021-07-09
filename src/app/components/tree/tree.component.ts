import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

// 1-Level Deep
export type TreeItem = {
  name: string;
  value: string;
  children?: Omit<TreeItem, "children" | "expanded">[];
  icon?: string;
  expanded?: boolean;
  active?: boolean;
};

@Component({
  selector: 'ngx-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  @Input() items: TreeItem[] = [];
  @Output() itemSelected = new EventEmitter<string | undefined>();

  constructor() { }

  ngOnInit(): void {
  }

  toggle(item: TreeItem) {
    item.expanded = !item.expanded;
  }

  isExpandable(item: TreeItem): boolean {
    return item.children && item.children.length > 0;
  }

  handleItem(value: string) {
    this.itemSelected.emit(value);
    this.items = this.items.map(item => ({ 
      ...item, 
      active: item.value === value,
      children: item.children?.map(cat => ({ ...cat, active: cat.value === value }))
    }));
  }
}
