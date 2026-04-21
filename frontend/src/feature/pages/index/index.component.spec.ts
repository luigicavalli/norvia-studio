/**
 * -------
 * ANGULAR
 * -------
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal }                    from '@angular/core';
import { ReactiveFormsModule }       from '@angular/forms';

/**
 * ----------
 * COMPONENTS
 * ----------
 */
import { IndexComponent } from './index.component';

/**
 * --------
 * SERVICES
 * --------
 */
import { AuthService } from '../../../services/auth.service';


// ─── Mock AuthService ────────────────────────────────────────────────────────

const mockAuthService = {
  isLoaded:   signal(true),
  isSignedIn: signal(false),
  user:       signal(null),
  signIn:     vi.fn(),
  signUp:     vi.fn(),
  signOut:    vi.fn(),
  getToken:   vi.fn().mockResolvedValue(null),
  init:       vi.fn().mockResolvedValue(undefined),
};


// ─── Helpers ─────────────────────────────────────────────────────────────────

function fillLoginForm(
  fixture:  ComponentFixture<IndexComponent>,
  email    = 'test@test.it',
  password = 'password123',
): void {
  const comp = fixture.componentInstance as any;
  comp.loginForm.setValue({ email, password });
  fixture.detectChanges();
}

function fillRegisterForm(
  fixture:   ComponentFixture<IndexComponent>,
  overrides: Record<string, unknown> = {},
): void {
  const comp = fixture.componentInstance as any;
  comp.registerForm.setValue({
    firstName: 'Mario',
    lastName:  'Rossi',
    birthDate: new Date('1990-01-01'),
    email:     'mario@test.it',
    password:  'password123',
    ...overrides,
  });
  fixture.detectChanges();
}


// ─── Suite ───────────────────────────────────────────────────────────────────

describe('IndexComponent', () => {

  let fixture:   ComponentFixture<IndexComponent>;
  let component: any; // cast to any to access protected members

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports:   [IndexComponent, ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture   = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // ── Initial state ─────────────────────────────────────────────────────────

  it('should start in login mode', () => {
    expect(component.mode()).toBe('login');
  });

  it('should start with loading false', () => {
    expect(component.loading()).toBe(false);
  });

  it('should start with empty authError', () => {
    expect(component.authError()).toBe('');
  });


  // ── Template – login mode ─────────────────────────────────────────────────

  it('should render the login form when mode is login', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('form')).toBeTruthy();
    expect(el.querySelector('app-button[label="Accedi"]')).toBeTruthy();
  });

  it('should not render the register form when mode is login', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-button[label="Crea account"]')).toBeNull();
  });

  it('should render brand panel', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.auth-brand')).toBeTruthy();
    expect(el.querySelector('.auth-brand__logo span')?.textContent).toBe('FlowDesk');
  });

  it('should render two tab buttons', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.auth-tab');
    expect(tabs.length).toBe(2);
  });

  it('should mark the login tab as active by default', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.auth-tab');
    expect(tabs[0].classList.contains('auth-tab--active')).toBe(true);
    expect(tabs[1].classList.contains('auth-tab--active')).toBe(false);
  });


  // ── Mode switching ────────────────────────────────────────────────────────

  it('should switch to register mode when register tab is clicked', () => {
    const tabs: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.auth-tab');
    tabs[1].click();
    fixture.detectChanges();
    expect(component.mode()).toBe('register');
  });

  it('should switch back to login mode when login tab is clicked', () => {
    component.setMode('register');
    fixture.detectChanges();

    const tabs: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.auth-tab');
    tabs[0].click();
    fixture.detectChanges();

    expect(component.mode()).toBe('login');
  });

  it('setMode should reset loginForm', () => {
    fillLoginForm(fixture);
    component.setMode('register');
    expect(component.loginForm.value.email).toBe(null);
  });

  it('setMode should reset registerForm', () => {
    component.setMode('register');
    fixture.detectChanges();
    fillRegisterForm(fixture);

    component.setMode('login');
    expect(component.registerForm.value.firstName).toBe(null);
  });

  it('setMode should clear authError', () => {
    component.authError.set('Qualche errore');
    component.setMode('register');
    expect(component.authError()).toBe('');
  });


  // ── Template – register mode ──────────────────────────────────────────────

  it('should render register form fields when mode is register', () => {
    component.setMode('register');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-button[label="Crea account"]')).toBeTruthy();
    expect(el.querySelector('app-datepicker')).toBeTruthy();
  });

  it('should render firstName and lastName inputs side by side in auth-form__row', () => {
    component.setMode('register');
    fixture.detectChanges();

    const row = fixture.nativeElement.querySelector('.auth-form__row');
    expect(row).toBeTruthy();
    const inputs = row.querySelectorAll('app-input');
    expect(inputs.length).toBe(2);
  });

  it('should mark the register tab as active when in register mode', () => {
    component.setMode('register');
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('.auth-tab');
    expect(tabs[1].classList.contains('auth-tab--active')).toBe(true);
    expect(tabs[0].classList.contains('auth-tab--active')).toBe(false);
  });


  // ── fieldError ────────────────────────────────────────────────────────────

  it('fieldError should return empty string when field is pristine', () => {
    expect(component.fieldError('login', 'email')).toBe('');
  });

  it('fieldError should return "Campo obbligatorio" for required error on touched field', () => {
    component.loginForm.get('email')!.markAsTouched();
    expect(component.fieldError('login', 'email')).toBe('Campo obbligatorio');
  });

  it('fieldError should return email message for invalid email on touched field', () => {
    component.loginForm.get('email')!.setValue('notanemail');
    component.loginForm.get('email')!.markAsTouched();
    expect(component.fieldError('login', 'email')).toBe("Inserisci un'email valida");
  });

  it('fieldError should return minlength message for short password', () => {
    component.loginForm.get('password')!.setValue('short');
    component.loginForm.get('password')!.markAsTouched();
    expect(component.fieldError('login', 'password')).toBe('Minimo 8 caratteri');
  });

  it('fieldError should work for register form fields', () => {
    component.registerForm.get('firstName')!.markAsTouched();
    expect(component.fieldError('register', 'firstName')).toBe('Campo obbligatorio');
  });


  // ── onLogin validation ────────────────────────────────────────────────────

  it('onLogin should not call signIn when form is invalid', async () => {
    await component.onLogin();
    expect(mockAuthService.signIn).not.toHaveBeenCalled();
  });

  it('onLogin should mark all fields as touched when form is invalid', async () => {
    await component.onLogin();
    expect(component.loginForm.get('email')!.touched).toBe(true);
    expect(component.loginForm.get('password')!.touched).toBe(true);
  });

  it('onLogin should call signIn with email and password when form is valid', async () => {
    mockAuthService.signIn.mockResolvedValue(undefined);
    fillLoginForm(fixture, 'user@test.it', 'password123');

    await component.onLogin();

    expect(mockAuthService.signIn).toHaveBeenCalledWith('user@test.it', 'password123');
  });

  it('onLogin should set authError on Clerk error', async () => {
    const clerkError = { errors: [{ message: 'Credenziali non valide' }] };
    mockAuthService.signIn.mockRejectedValue(clerkError);
    fillLoginForm(fixture);

    await component.onLogin();

    expect(component.authError()).toBe('Credenziali non valide');
  });

  it('onLogin should set generic authError on unknown error', async () => {
    mockAuthService.signIn.mockRejectedValue(new Error('network error'));
    fillLoginForm(fixture);

    await component.onLogin();

    expect(component.authError()).toBe('Si è verificato un errore. Riprova.');
  });

  it('onLogin should set loading true during call and false after', async () => {
    let loadingDuring = false;
    mockAuthService.signIn.mockImplementation(() => {
      loadingDuring = component.loading();
      return Promise.resolve();
    });
    fillLoginForm(fixture);

    await component.onLogin();

    expect(loadingDuring).toBe(true);
    expect(component.loading()).toBe(false);
  });

  it('should display authError in the template', async () => {
    const clerkError = { errors: [{ message: 'Errore di test' }] };
    mockAuthService.signIn.mockRejectedValue(clerkError);
    fillLoginForm(fixture);

    await component.onLogin();
    fixture.detectChanges();

    const errEl: HTMLElement = fixture.nativeElement.querySelector('.auth-error');
    expect(errEl?.textContent?.trim()).toBe('Errore di test');
  });


  // ── onRegister validation ─────────────────────────────────────────────────

  it('onRegister should not call signUp when form is invalid', async () => {
    component.setMode('register');
    fixture.detectChanges();

    await component.onRegister();

    expect(mockAuthService.signUp).not.toHaveBeenCalled();
  });

  it('onRegister should mark all register fields as touched when form is invalid', async () => {
    component.setMode('register');
    fixture.detectChanges();

    await component.onRegister();

    expect(component.registerForm.get('firstName')!.touched).toBe(true);
    expect(component.registerForm.get('email')!.touched).toBe(true);
  });

  it('onRegister should call signUp with correct data when form is valid', async () => {
    mockAuthService.signUp.mockResolvedValue(undefined);
    component.setMode('register');
    fixture.detectChanges();

    const birthDate = new Date('1990-05-15');
    fillRegisterForm(fixture, { birthDate });

    await component.onRegister();

    expect(mockAuthService.signUp).toHaveBeenCalledWith({
      firstName: 'Mario',
      lastName:  'Rossi',
      birthDate,
      email:     'mario@test.it',
      password:  'password123',
    });
  });

  it('onRegister should set authError on Clerk error', async () => {
    const clerkError = { errors: [{ message: 'Email già in uso' }] };
    mockAuthService.signUp.mockRejectedValue(clerkError);
    component.setMode('register');
    fixture.detectChanges();
    fillRegisterForm(fixture);

    await component.onRegister();

    expect(component.authError()).toBe('Email già in uso');
  });

  it('onRegister should reset loading to false even on error', async () => {
    mockAuthService.signUp.mockRejectedValue({ errors: [{ message: 'Errore' }] });
    component.setMode('register');
    fixture.detectChanges();
    fillRegisterForm(fixture);

    await component.onRegister();

    expect(component.loading()).toBe(false);
  });


  // ── parseClerkError (via onLogin) ─────────────────────────────────────────

  it('should extract first error message from Clerk errors array', async () => {
    mockAuthService.signIn.mockRejectedValue({
      errors: [{ message: 'Primo errore' }, { message: 'Secondo errore' }],
    });
    fillLoginForm(fixture);

    await component.onLogin();

    expect(component.authError()).toBe('Primo errore');
  });

  it('should fallback to "Errore sconosciuto" when errors array is empty', async () => {
    mockAuthService.signIn.mockRejectedValue({ errors: [] });
    fillLoginForm(fixture);

    await component.onLogin();

    expect(component.authError()).toBe('Errore sconosciuto');
  });

});
