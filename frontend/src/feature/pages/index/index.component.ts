/**
 * -------
 * ANGULAR
 * -------
 */
import { Component, inject, signal }                               from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * --------
 * SERVICES
 * --------
 */
import { AuthService } from '../../../services/auth.service';

/**
 * ----------
 * COMPONENTS
 * ----------
 */
import { InputComponent }      from '../../components/shared/input/input.component';
import { ButtonComponent }     from '../../components/shared/button/button.component';
import { DatepickerComponent } from '../../components/shared/datepicker/datepicker.component';


type AuthMode = 'login' | 'register' | 'mfa';

@Component({
  selector:    'app-index',
  imports:     [ReactiveFormsModule, ButtonComponent, DatepickerComponent, InputComponent],
  styleUrl:    './index.component.scss',
  templateUrl: './index.component.html',
})
export class IndexComponent {

  private  readonly fb   = inject(FormBuilder);
  private  readonly auth = inject(AuthService);

  protected readonly mode      = signal<AuthMode>('login');
  protected readonly loading   = signal<boolean>(false);
  protected readonly authError = signal<string>('');

  protected readonly loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly registerForm = this.fb.group({
    firstName: ['',  Validators.required],
    lastName:  ['',  Validators.required],
    birthDate: [null as Date | null, Validators.required],
    email:     ['',  [Validators.required, Validators.email]],
    password:  ['',  [Validators.required, Validators.minLength(8)]],
  });

  protected readonly mfaForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
  });

  protected setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.authError.set('');
    this.loginForm.reset();
    this.registerForm.reset();
  }

  protected async onLogin(): Promise<void> {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }

    this.loading.set(true);
    this.authError.set('');

    try {
      const { email, password } = this.loginForm.value;
      const result = await this.auth.signIn(email!, password!);

      if (result === 'needs_second_factor') {
        this.mode.set('mfa');
        this.authError.set('');
      }
    } catch (err: unknown) {
      this.authError.set(this.parseClerkError(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected async onMfa(): Promise<void> {
    if (this.mfaForm.invalid) { this.mfaForm.markAllAsTouched(); return; }

    this.loading.set(true);
    this.authError.set('');

    try {
      await this.auth.verifyMfa(this.mfaForm.value.code!);
    } catch (err: unknown) {
      this.authError.set(this.parseClerkError(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected async onRegister(): Promise<void> {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }

    this.loading.set(true);
    this.authError.set('');

    try {
      const v = this.registerForm.value;
      await this.auth.signUp({
        firstName: v.firstName!,
        lastName:  v.lastName!,
        birthDate: v.birthDate ?? null,
        email:     v.email!,
        password:  v.password!,
      });
    } catch (err: unknown) {
      this.authError.set(this.parseClerkError(err));
    } finally {
      this.loading.set(false);
    }
  }

  protected fieldError(form: 'login' | 'register' | 'mfa', field: string): string {
    const group = (
      form === 'login'    ? this.loginForm    :
      form === 'register' ? this.registerForm :
      this.mfaForm
    ) as FormGroup;

    const ctrl = group.get(field);
    if (!ctrl?.invalid || !ctrl.touched) return '';

    const e = ctrl.errors ?? {};
    if (e['required'])  return 'Campo obbligatorio';
    if (e['email'])     return 'Inserisci un\'email valida';
    if (e['minlength']) return `Minimo ${e['minlength'].requiredLength} caratteri`;

    return '';
  }

  private parseClerkError(err: unknown): string {
    if (err && typeof err === 'object' && 'errors' in err) {
      const errors = (err as { errors: { message: string }[] }).errors;
      return errors?.[0]?.message ?? 'Errore sconosciuto';
    }
    return 'Si è verificato un errore. Riprova.';
  }

}
