import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators }                   from '@angular/forms';
import { RouterLink, RouterLinkActive }                                   from '@angular/router';

import { AuthService }      from '../../../services/auth.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { ToastService }     from '../shared/toast/toast.service';
import { InputComponent }   from '../shared/input/input.component';
import { ButtonComponent }  from '../shared/button/button.component';
import { ModalComponent }   from '../shared/modal/modal.component';


interface NavItem {
  label: string;
  path:  string;
  icon:  string;
}

@Component({
  selector:    'app-sidebar',
  standalone:  true,
  imports:     [RouterLink, RouterLinkActive, ReactiveFormsModule, InputComponent, ButtonComponent, ModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl:    './sidebar.component.scss',
})
export class SidebarComponent {

  private readonly auth               = inject(AuthService);
  private readonly elRef              = inject(ElementRef);
  private readonly toast              = inject(ToastService);
  private readonly fb                 = inject(FormBuilder);
  protected readonly workspaceService = inject(WorkspaceService);

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
  protected readonly avatarUrl = computed(() => this.user()?.imageUrl ?? null);

  readonly mobileOpen   = signal(false);
  readonly switcherOpen = signal(false);
  readonly createOpen   = signal(false);
  readonly saving       = signal(false);

  protected readonly createForm = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  open():  void { this.mobileOpen.set(true);  }
  close(): void { this.mobileOpen.set(false); }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (this.switcherOpen() && !this.elRef.nativeElement.contains(target)) {
      this.switcherOpen.set(false);
    }
  }

  protected switchWorkspace(id: string): void {
    this.workspaceService.setActive(id);
    this.switcherOpen.set(false);
  }

  protected openCreateModal(): void {
    this.createForm.reset();
    this.switcherOpen.set(false);
    this.createOpen.set(true);
  }

  protected async onCreateWorkspace(): Promise<void> {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }

    this.saving.set(true);
    try {
      const { name, description } = this.createForm.value;
      await this.workspaceService.create(name!, description ?? undefined);
      this.createOpen.set(false);
      this.toast.success('Workspace creato con successo!');
    } catch {
      this.toast.danger('Errore durante la creazione del workspace.');
    } finally {
      this.saving.set(false);
    }
  }

  protected readonly navItems: NavItem[] = [
    { label: 'Home',     path: '/home',      icon: 'home'     },
    { label: 'Progetti', path: '/projects',  icon: 'folder'   },
    { label: 'Clienti',  path: '/clients',   icon: 'briefcase'},
    { label: 'Aziende',  path: '/companies', icon: 'building' },
    { label: 'Team',     path: '/team',      icon: 'users'    },
  ];

  protected async onSignOut(): Promise<void> {
    await this.auth.signOut();
  }

}
