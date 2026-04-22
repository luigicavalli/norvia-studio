import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive }        from '@angular/router';

import { AuthService } from '../../../services/auth.service';


interface NavItem {
  label: string;
  path:  string;
  icon:  string;
}

@Component({
  selector:    'app-sidebar',
  standalone:  true,
  imports:     [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl:    './sidebar.component.scss',
})
export class SidebarComponent {

  private readonly auth = inject(AuthService);

  protected readonly user        = this.auth.user;
  protected readonly initials    = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  });
  protected readonly displayName = computed(() => {
    const u = this.user();
    return [u?.firstName, u?.lastName].filter(Boolean).join(' ') || '';
  });
  protected readonly avatarUrl   = computed(() => this.user()?.imageUrl ?? null);

  readonly mobileOpen = signal(false);

  open():  void { this.mobileOpen.set(true);  }
  close(): void { this.mobileOpen.set(false); }

  protected readonly navItems: NavItem[] = [
    { label: 'Home',        path: '/home',     icon: 'home'      },
    { label: 'Progetti',    path: '/projects', icon: 'folder'    },
    { label: 'Clienti',     path: '/clients',  icon: 'briefcase' },
    { label: 'Team',        path: '/team',     icon: 'users'     },
  ];

  protected async onSignOut(): Promise<void> {
    await this.auth.signOut();
  }

}
