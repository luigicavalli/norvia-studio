import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService }                         from '@ngx-translate/core';

import { AuthService }  from '../../../services/auth.service';
import { ToastService } from '../../components/shared/toast/toast.service';
import { AvatarComponent }  from '../../components/shared/avatar/avatar.component';
import { InputComponent }   from '../../components/shared/input/input.component';
import { ButtonComponent }  from '../../components/shared/button/button.component';
import { ModalComponent }   from '../../components/shared/modal/modal.component';


@Component({
  selector:    'app-account',
  standalone:  true,
  imports:     [ReactiveFormsModule, TranslatePipe, AvatarComponent, InputComponent, ButtonComponent, ModalComponent],
  templateUrl: './account.component.html',
  styleUrl:    './account.component.scss',
})
export class AccountComponent implements OnInit {

  private readonly auth      = inject(AuthService);
  private readonly toast     = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly fb        = inject(FormBuilder);

  protected readonly user        = this.auth.user;
  protected readonly displayName = computed(() => {
    const u = this.user();
    return [u?.firstName, u?.lastName].filter(Boolean).join(' ') || this.translate.instant('ACCOUNT.USER_FALLBACK');
  });
  protected readonly email = computed(() =>
    this.user()?.primaryEmailAddress?.emailAddress ?? '',
  );

  protected readonly profileSaving  = signal(false);
  protected readonly passwordSaving = signal(false);
  protected readonly deleteOpen     = signal(false);
  protected readonly deleting       = signal(false);
  protected readonly confirmEmail   = signal('');

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
      this.toast.success(this.translate.instant('ACCOUNT.TOAST.PROFILE_UPDATED'));
    } catch {
      this.toast.danger(this.translate.instant('ACCOUNT.TOAST.PROFILE_ERROR'));
    } finally {
      this.profileSaving.set(false);
    }
  }

  protected async onUpdatePassword(): Promise<void> {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toast.warning(this.translate.instant('ACCOUNT.TOAST.PASSWORD_MISMATCH'));
      return;
    }

    this.passwordSaving.set(true);
    try {
      await this.auth.updatePassword(currentPassword!, newPassword!);
      this.toast.success(this.translate.instant('ACCOUNT.TOAST.PASSWORD_UPDATED'));
      this.passwordForm.reset();
    } catch {
      this.toast.danger(this.translate.instant('ACCOUNT.TOAST.PASSWORD_ERROR'));
    } finally {
      this.passwordSaving.set(false);
    }
  }

  protected openDeleteModal(): void {
    this.confirmEmail.set('');
    this.deleteOpen.set(true);
  }

  protected async onDeleteAccount(): Promise<void> {
    if (this.confirmEmail() !== this.email()) return;

    this.deleting.set(true);
    try {
      await this.auth.deleteAccount();
    } catch {
      this.toast.danger(this.translate.instant('ACCOUNT.TOAST.DELETE_ERROR'));
      this.deleting.set(false);
    }
  }

  protected fieldError(form: 'profile' | 'password', field: string): string {
    const group = (form === 'profile' ? this.profileForm : this.passwordForm) as FormGroup;
    const ctrl  = group.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';
    const e = ctrl.errors ?? {};
    if (e['required'])  return this.translate.instant('VALIDATION.REQUIRED');
    if (e['minlength']) return this.translate.instant('VALIDATION.MIN_LENGTH', { length: e['minlength'].requiredLength });
    return '';
  }

}
