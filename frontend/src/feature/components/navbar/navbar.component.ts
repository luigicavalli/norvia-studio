import { Component, computed, HostListener, inject, signal, ElementRef } from '@angular/core';
import { RouterLink }                                                       from '@angular/router';

import { AuthService } from '../../../services/auth.service';


interface Notification {
  id:      number;
  text:    string;
  time:    string;
  unread:  boolean;
}

@Component({
  selector:    'app-navbar',
  standalone:  true,
  imports:     [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl:    './navbar.component.scss',
})
export class NavbarComponent {

  private readonly auth    = inject(AuthService);
  private readonly elRef   = inject(ElementRef);

  protected readonly notifOpen    = signal(false);
  protected readonly userMenuOpen = signal(false);

  protected readonly user      = this.auth.user;
  protected readonly initials  = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  });
  protected readonly displayName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return [u.firstName, u.lastName].filter(Boolean).join(' ');
  });
  protected readonly avatarUrl = computed(() => this.user()?.imageUrl ?? null);

  protected readonly notifications = signal<Notification[]>([
    { id: 1, text: 'Benvenuto su FlowDesk!', time: 'adesso',    unread: true  },
    { id: 2, text: 'Il tuo account è pronto.', time: '1 min fa', unread: true  },
  ]);

  protected readonly unreadCount = computed(() =>
    this.notifications().filter(n => n.unread).length,
  );

  protected toggleNotif(): void {
    this.notifOpen.update(v => !v);
    if (this.notifOpen()) this.userMenuOpen.set(false);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
    if (this.userMenuOpen()) this.notifOpen.set(false);
  }

  protected markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, unread: false })));
  }

  protected async onSignOut(): Promise<void> {
    await this.auth.signOut();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.notifOpen.set(false);
      this.userMenuOpen.set(false);
    }
  }

}
