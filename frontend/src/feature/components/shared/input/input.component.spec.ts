import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';


describe('InputComponent', () => {

  let fixture:   ComponentFixture<InputComponent>;
  let component: InputComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Label ---

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    expect(el.querySelector('.inp-label')?.textContent?.trim()).toBe('Email');
  });

  it('should not render label when empty', () => {
    expect(el.querySelector('.inp-label')).toBeNull();
  });

  it('should associate label with input via for/id', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    const labelFor = el.querySelector('label')?.getAttribute('for');
    const inputId  = el.querySelector('input')?.id;
    expect(labelFor).toBe(inputId);
  });

  // --- Input nativo ---

  it('should set input type', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();
    expect(el.querySelector('input')?.type).toBe('email');
  });

  it('should set placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'es. mario@email.it');
    fixture.detectChanges();
    expect(el.querySelector('input')?.placeholder).toBe('es. mario@email.it');
  });

  it('should set readonly', () => {
    fixture.componentRef.setInput('readOnly', true);
    fixture.detectChanges();
    expect(el.querySelector('input')?.readOnly).toBe(true);
  });

  // --- ControlValueAccessor ---

  it('should set input value via writeValue', () => {
    component.writeValue('ciao');
    fixture.detectChanges();
    expect((el.querySelector('input') as HTMLInputElement).value).toBe('ciao');
  });

  it('should call onChange when user types', () => {
    let changed = '';
    component.registerOnChange((v: string) => changed = v);
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(changed).toBe('test');
  });

  it('should call onTouched on blur', () => {
    let touched = false;
    component.registerOnTouched(() => touched = true);
    el.querySelector('input')?.dispatchEvent(new Event('blur'));
    expect(touched).toBe(true);
  });

  it('should disable input via setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect((el.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });

  // --- Messaggi ---

  it('should show hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Campo obbligatorio');
    fixture.detectChanges();
    expect(el.querySelector('.inp-message')?.textContent?.trim()).toBe('Campo obbligatorio');
  });

  it('should show error message when error=true', () => {
    fixture.componentRef.setInput('error',        true);
    fixture.componentRef.setInput('errorMessage', 'Campo non valido');
    fixture.detectChanges();
    const msg = el.querySelector('.inp-message--error');
    expect(msg?.textContent?.trim()).toBe('Campo non valido');
  });

  it('should prefer error message over hint when error=true', () => {
    fixture.componentRef.setInput('error',        true);
    fixture.componentRef.setInput('errorMessage', 'Errore');
    fixture.componentRef.setInput('hint',         'Hint');
    fixture.detectChanges();
    expect(el.querySelector('.inp-message--error')).toBeTruthy();
    expect(el.querySelector('.inp-message:not(.inp-message--error)')).toBeNull();
  });

  it('should apply error class to container when error=true', () => {
    fixture.componentRef.setInput('error', true);
    fixture.detectChanges();
    expect(el.querySelector('.inp-container')?.classList).toContain('inp--error');
  });

  // --- Password toggle ---

  it('should show eye button when type=password', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    expect(el.querySelector('.inp-eye')).toBeTruthy();
  });

  it('should not show eye button for other types', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.detectChanges();
    expect(el.querySelector('.inp-eye')).toBeNull();
  });

  it('should toggle password visibility on eye button click', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const input  = el.querySelector('input') as HTMLInputElement;
    const eyeBtn = el.querySelector('.inp-eye') as HTMLButtonElement;

    expect(input.type).toBe('password');

    eyeBtn.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');

    eyeBtn.click();
    fixture.detectChanges();
    expect(input.type).toBe('password');
  });

});
