import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService }     from '../../../services/auth.service';
import { TeamService }      from '../../../services/team.service';
import type { MemberRole }  from '../../../models/team.model';
import { ToastService }    from '../../components/shared/toast/toast.service';
import { AvatarComponent } from '../../components/shared/avatar/avatar.component';
import { BadgeComponent, BadgeVariant }  from '../../components/shared/badge/badge.component';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { InputComponent }  from '../../components/shared/input/input.component';
import { SelectComponent } from '../../components/shared/select/select.component';
import { ModalComponent }  from '../../components/shared/modal/modal.component';
import { SelectOption }    from '../../components/shared/select/select.types';


@Component({
  selector:    'app-team',
  standalone:  true,
  imports:     [ReactiveFormsModule, AvatarComponent, BadgeComponent,
                ButtonComponent, InputComponent, SelectComponent, ModalComponent],
  templateUrl: './team.component.html',
  styleUrl:    './team.component.scss',
})
export class TeamComponent {

  protected readonly teamService = inject(TeamService);
  protected readonly auth        = inject(AuthService);
  private   readonly toast       = inject(ToastService);
  private   readonly fb          = inject(FormBuilder);

  protected readonly modalOpen = signal(false);

  protected readonly currentUser = computed(() => {
    const u = this.auth.user();
    return {
      id:        u?.id ?? '',
      name:      [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'Tu',
      email:     u?.primaryEmailAddress?.emailAddress ?? '',
      avatarUrl: u?.imageUrl ?? null,
    };
  });

  protected readonly activeMembers = computed(() =>
    this.teamService.active().filter(m => m.userId !== this.currentUser().id),
  );

  protected readonly currentUserRole = computed(() =>
    this.teamService.members().find(m => m.userId === this.currentUser().id)?.role ?? 'owner',
  );

  protected readonly totalCount = computed(() =>
    this.teamService.members().length,
  );

  protected readonly roleOptions: SelectOption[] = [
    { value: 'admin',  label: 'Amministratore' },
    { value: 'member', label: 'Membro'         },
    { value: 'viewer', label: 'Osservatore'    },
  ];

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role:  ['member' as MemberRole, Validators.required],
  });

  protected openModal(): void {
    this.form.reset({ role: 'member' });
    this.modalOpen.set(true);
  }

  protected onInvite(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const { email, role } = this.form.value;

    const alreadyExists = this.teamService.members().some(m => m.email === email);
    if (alreadyExists) {
      this.toast.warning('Questo indirizzo email è già nel team.');
      return;
    }

    this.teamService.invite({ email: email!, role: role as MemberRole });
    this.modalOpen.set(false);
    this.toast.success(`Invito inviato a ${email}.`);
  }

  protected removeMember(id: string, email: string): void {
    this.teamService.remove(id);
    this.toast.info(`${email} rimosso dal team.`);
  }

  protected roleBadge(role: MemberRole): { label: string; variant: BadgeVariant } {
    const map: Record<string, { label: string; variant: BadgeVariant }> = {
      admin:      { label: 'Amministratore', variant: 'info'    },
      owner:      { label: 'Proprietario',   variant: 'info'    },
      superadmin: { label: 'Super Admin',    variant: 'info'    },
      member:     { label: 'Membro',         variant: 'default' },
      viewer:     { label: 'Osservatore',    variant: 'default' },
    };
    return map[role] ?? { label: role, variant: 'default' };
  }

  protected fieldError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    if (ctrl.hasError('required')) return 'Campo obbligatorio';
    if (ctrl.hasError('email'))    return "Inserisci un'email valida";
    return '';
  }

}
