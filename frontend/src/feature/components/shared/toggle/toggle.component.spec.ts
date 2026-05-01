import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleComponent } from './toggle.component';


describe('ToggleComponent', () => {

  let fixture:   ComponentFixture<ToggleComponent>;
  let component: ToggleComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Stato iniziale ---

  it('should be unchecked by default', () => {
    expect(el.querySelector('.toggle__track--on')).toBeNull();
    expect(el.querySelector('.toggle__thumb--on')).toBeNull();
  });

  // --- Toggle ---

  it('should turn on when clicked', () => {
    el.querySelector<HTMLElement>('.toggle')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.toggle__track--on')).toBeTruthy();
    expect(el.querySelector('.toggle__thumb--on')).toBeTruthy();
  });

  it('should turn off on second click', () => {
    const toggle = el.querySelector<HTMLElement>('.toggle')!;
    toggle.click(); fixture.detectChanges();
    toggle.click(); fixture.detectChanges();
    expect(el.querySelector('.toggle__track--on')).toBeNull();
  });

  // --- Disabled ---

  it('should not toggle when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    el.querySelector<HTMLElement>('.toggle')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.toggle__track--on')).toBeNull();
  });

  it('should apply disabled class when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.querySelector('.toggle--disabled')).toBeTruthy();
  });

  // --- Label e hint ---

  it('should show label when provided', () => {
    fixture.componentRef.setInput('label', 'Notifiche');
    fixture.detectChanges();
    expect(el.querySelector('.toggle__label')?.textContent?.trim()).toBe('Notifiche');
  });

  it('should not render label section when label is empty', () => {
    expect(el.querySelector('.toggle__text')).toBeNull();
  });

  it('should show hint when both label and hint are provided', () => {
    fixture.componentRef.setInput('label', 'Notifiche');
    fixture.componentRef.setInput('hint',  'Ricevi aggiornamenti via email');
    fixture.detectChanges();
    expect(el.querySelector('.toggle__hint')?.textContent?.trim()).toBe('Ricevi aggiornamenti via email');
  });

  it('should not show hint element when hint is empty', () => {
    fixture.componentRef.setInput('label', 'Notifiche');
    fixture.detectChanges();
    expect(el.querySelector('.toggle__hint')).toBeNull();
  });

  // --- ControlValueAccessor ---

  it('should set checked via writeValue(true)', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(el.querySelector('.toggle__track--on')).toBeTruthy();
  });

  it('should unset checked via writeValue(false)', () => {
    component.writeValue(true);
    fixture.detectChanges();
    component.writeValue(false);
    fixture.detectChanges();
    expect(el.querySelector('.toggle__track--on')).toBeNull();
  });

  it('should call onChange when toggled', () => {
    let changed: boolean | null = null;
    component.registerOnChange((v: boolean) => changed = v);
    el.querySelector<HTMLElement>('.toggle')?.click();
    expect(changed).toBe(true);
  });

  it('should call onChange with false on second toggle', () => {
    const values: boolean[] = [];
    component.registerOnChange((v: boolean) => values.push(v));
    const toggle = el.querySelector<HTMLElement>('.toggle')!;
    toggle.click();
    toggle.click();
    expect(values).toEqual([true, false]);
  });

  it('should call onTouched when toggled', () => {
    let touched = false;
    component.registerOnTouched(() => touched = true);
    el.querySelector<HTMLElement>('.toggle')?.click();
    expect(touched).toBe(true);
  });

  it('should not call onChange when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let called = false;
    component.registerOnChange(() => called = true);
    el.querySelector<HTMLElement>('.toggle')?.click();
    expect(called).toBe(false);
  });

});
