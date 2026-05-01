import { Component, computed, input } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector:    'app-avatar',
  standalone:  true,
  templateUrl: './avatar.component.html',
  styleUrl:    './avatar.component.scss',
})
export class AvatarComponent {
  readonly name     = input<string>('');
  readonly imageUrl = input<string | null>(null);
  readonly size     = input<AvatarSize>('md');

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (parts[0]?.[0] ?? '?').toUpperCase();
  });
}
