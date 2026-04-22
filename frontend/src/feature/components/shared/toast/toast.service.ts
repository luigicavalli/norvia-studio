import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id:      number;
  message: string;
  variant: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  private nextId = 0;

  readonly toasts = signal<Toast[]>([]);

  show(message: string, variant: ToastVariant = 'info', duration = 4000): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, message, variant }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  success(message: string): void { this.show(message, 'success'); }
  danger (message: string): void { this.show(message, 'danger');  }
  warning(message: string): void { this.show(message, 'warning'); }
  info   (message: string): void { this.show(message, 'info');    }

}
