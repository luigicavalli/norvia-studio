import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';


describe('ButtonComponent', () => {

  let fixture:   ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Label ---

  it('should render label', () => {
    fixture.componentRef.setInput('label', 'Salva');
    fixture.detectChanges();
    expect(el.querySelector('.btn__content')?.textContent?.trim()).toBe('Salva');
  });

  it('should hide label when iconOnly is true', () => {
    fixture.componentRef.setInput('label',    'Hidden');
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(el.querySelector('.btn__content')?.textContent?.trim()).toBe('');
  });

  // --- Classi ---

  it('should apply variant class', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    expect(el.querySelector('button')?.classList).toContain('btn--outlined');
  });

  it('should apply size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.querySelector('button')?.classList).toContain('btn--lg');
  });

  it('should apply color class', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();
    expect(el.querySelector('button')?.classList).toContain('btn--danger');
  });

  it('should apply icon-only class', () => {
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(el.querySelector('button')?.classList).toContain('btn--icon-only');
  });

  // --- Disabled ---

  it('should be disabled when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.querySelector('button')?.disabled).toBe(true);
  });

  it('should be disabled when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el.querySelector('button')?.disabled).toBe(true);
  });

  // --- Loading ---

  it('should show spinner when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el.querySelector('.btn__spinner')).toBeTruthy();
  });

  it('should not show spinner when not loading', () => {
    expect(el.querySelector('.btn__spinner')).toBeNull();
  });

  it('should hide content when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el.querySelector('.btn__content')?.classList).toContain('btn__content--hidden');
  });

  // --- Click output ---

  it('should emit clicked on click', () => {
    let emitted = false;
    component.clicked.subscribe(() => emitted = true);
    el.querySelector('button')?.click();
    expect(emitted).toBe(true);
  });

  it('should not emit clicked when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    component.clicked.subscribe(() => emitted = true);
    el.querySelector('button')?.click();
    expect(emitted).toBe(false);
  });

  it('should not emit clicked when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    let emitted = false;
    component.clicked.subscribe(() => emitted = true);
    el.querySelector('button')?.click();
    expect(emitted).toBe(false);
  });

  // --- Attributi nativi ---

  it('should set native button type', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(el.querySelector('button')?.type).toBe('submit');
  });

  it('should set aria-label when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Chiudi');
    fixture.detectChanges();
    expect(el.querySelector('button')?.getAttribute('aria-label')).toBe('Chiudi');
  });

});
