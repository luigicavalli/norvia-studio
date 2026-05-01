import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize    = 'sm' | 'md';

@Component({
  selector:   'app-badge',
  standalone: true,
  template:   `<span class="badge badge--{{ variant() }} badge--{{ size() }}">{{ label() }}</span>`,
  styleUrl:   './badge.component.scss',
})
export class BadgeComponent {
  readonly label   = input.required<string>();
  readonly variant = input<BadgeVariant>('default');
  readonly size    = input<BadgeSize>('md');
}
