/**
 * -------
 * ANGULAR
 * -------
 */
import { Component, inject, signal }                               from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/**
 * ----------
 * COMPONENTS
 * ----------
 */
import { ButtonComponent }      from '../../components/shared/button/button.component';
import { DatepickerComponent }  from '../../components/shared/datepicker/datepicker.component';
import { InputComponent }       from '../../components/shared/input/input.component';


type AuthMode = 'login' | 'register';

@Component({
  selector:    'app-index',
  imports:     [ ReactiveFormsModule, ButtonComponent, DatepickerComponent, InputComponent ],
  styleUrl:    './index.component.scss',
  templateUrl: './index.component.html',
})
export class IndexComponent {

  private   readonly fb      = inject(FormBuilder);
  protected readonly mode    = signal<AuthMode>('login');
  protected readonly loading = signal<boolean>(false);

  protected readonly loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly registerForm = this.fb.group({
    firstName:   ['',  Validators.required],
    lastName:    ['',  Validators.required],
    birthDate:   [null as Date | null, Validators.required],
    email:       ['',  [Validators.required, Validators.email]],
    password:    ['',  [Validators.required, Validators.minLength(8)]],
  });

  protected setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  protected onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    // TODO: integrazione Clerk
  }

  protected onRegister(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading.set(true);
    // TODO: integrazione Clerk
  }

  protected fieldError(form: 'login' | 'register', field: string): string {
    const group = (form === 'login' ? this.loginForm : this.registerForm) as FormGroup;
    const ctrl  = group.get(field);

    if (!ctrl?.invalid || !ctrl.touched) return '';

    const e = ctrl.errors ?? {};

    if (e['required'])  return 'Campo obbligatorio';
    if (e['email'])     return 'Inserisci un\'email valida';
    if (e['minlength']) return `Minimo ${e['minlength'].requiredLength} caratteri`;

    return '';
  }

}
