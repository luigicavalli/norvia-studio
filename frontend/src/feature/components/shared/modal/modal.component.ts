import { Component, input, output, HostListener } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector:    'app-modal',
  standalone:  true,
  templateUrl: './modal.component.html',
  styleUrl:    './modal.component.scss',
})
export class ModalComponent {
  readonly open  = input.required<boolean>();
  readonly title = input<string>('');
  readonly size  = input<ModalSize>('md');

  readonly closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }
}
