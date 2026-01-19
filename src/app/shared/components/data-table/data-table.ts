import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  icon: string;
  action: (row: any) => void;
  color?: 'primary' | 'danger' | 'warning';
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  standalone: false
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onAction(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    action.action(row);
  }

  getValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }
}
