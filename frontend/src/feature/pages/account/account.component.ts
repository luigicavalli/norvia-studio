import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService }  from '../../../services/auth.service';
import { ToastService } from '../../components/shared/toast/toast.service';
import { AvatarComponent }  from '../../components/shared/avatar/avatar.component';
import { InputComponent }   from '../../components/shared/input/input.component';
import { ButtonComponent }  from '../../components/shared/button/button.component';


@Component({
  selector:    'app-account',
  standalone:  true,
  imports:     [ReactiveFormsModule, AvatarComponent, InputComponent, ButtonComponent],
  templateUrl: './account.component.html',
  styleUrl:    './account.component.scss',
})
export class AccountComponent implements OnInit {

  private readonly auth  = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly fb    = inject(FormBuilder);

  protected readonly user        = this.auth.user;
  protected readonly displayName = computed(() => {
    const u = this.user();
    return [u?.firstName, u?.lastName].filter(Boolean).join(' ') || 'Utente';
  });
  protected readonly email = computed(() =>
    this.user()?.primaryEmailAddress?.emailAddress ?? '',
  );

  protected readonly profileSaving  = signal(false);
  protected readonly passwordSaving = signal(false);

  protected readonly profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
  });

  protected readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword:     ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const u = this.user();
    this.profileForm.patchValue({
      firstName: u?.firstName ?? '',
      lastName:  u?.lastName  ?? '',
    });
  }

  protected async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }

    this.profileSaving.set(true);
    try {
      const { firstName, lastName } = this.profileForm.value;
      await this.auth.updateProfile(firstName!, lastName!);
      this.toast.success('Profilo aggiornato con successo.');
    } catch {
      this.toast.danger('Errore durante l\'aggiornamento del profilo.');
    } finally {
      this.profileSaving.set(false);
    }
  }

  protected async onUpdatePassword(): Promise<void> {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toast.warning('Le password non coincidono.');
      return;
    }

    this.passwordSaving.set(true);
    try {
      await this.auth.updatePassword(currentPassword!, newPassword!);
      this.toast.success('Password aggiornata con successo.');
      this.passwordForm.reset();
    } catch {
      this.toast.danger('Password attuale non corretta.');
    } finally {
      this.passwordSaving.set(false);
    }
  }

  protected fieldError(form: 'profile' | 'password', field: string): string {
    const group = (form === 'profile' ? this.profileForm : this.passwordForm) as FormGroup;
    const ctrl  = group.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    const e = ctrl.errors ?? {};
    if (e['required'])  return 'Campo obbligatorio';
    if (e['minlength']) return `Minimo ${e['minlength'].requiredLength} caratteri`;
    return '';
  }

}
