import { Component, input, output, signal } from '@angular/core';

import { TableColumn, SortState } from './table.types';


@Component({
  selector:    'app-table',
  standalone:  true,
  templateUrl: './table.component.html',
  styleUrl:    './table.component.scss',
})
export class TableComponent<T extends Record<string, unknown>> {
  readonly columns      = input.required<TableColumn<T>[]>();
  readonly rows         = input.required<T[]>();
  readonly loading      = input<boolean>(false);
  readonly emptyMessage = input<string>('Nessun risultato');
  readonly trackByKey   = input<keyof T & string>('id');

  readonly sortChange = output<SortState>();

  protected readonly sort = signal<SortState | null>(null);

  protected onSort(col: TableColumn<T>): void {
    if (!col.sortable) return;

    const current = this.sort();
    const next: SortState =
      current?.key === col.key && current.direction === 'asc'
        ? { key: col.key, direction: 'desc' }
        : { key: col.key, direction: 'asc'  };

    this.sort.set(next);
    this.sortChange.emit(next);
  }

  protected trackRow(_: number, row: T): unknown {
    return row[this.trackByKey()];
  }

  protected cellValue(row: T, key: string): unknown {
    return row[key];
  }
}
