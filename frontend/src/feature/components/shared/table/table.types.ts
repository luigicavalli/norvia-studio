export interface TableColumn<T = Record<string, unknown>> {
  key:       keyof T & string;
  label:     string;
  sortable?: boolean;
  width?:    string;
}

export interface SortState {
  key:       string;
  direction: 'asc' | 'desc';
}
