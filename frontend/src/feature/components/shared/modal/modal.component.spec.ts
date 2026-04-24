import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';


describe('ModalComponent', () => {

  let fixture:   ComponentFixture<ModalComponent>;
  let component: ModalComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Visibilità ---

  it('should not render modal when open=false', () => {
    expect(el.querySelector('.modal-overlay')).toBeNull();
  });

  it('should render modal when open=true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(el.querySelector('.modal-overlay')).toBeTruthy();
    expect(el.querySelector('.modal')).toBeTruthy();
  });

  // --- Titolo ---

  it('should display title', () => {
    fixture.componentRef.setInput('open',  true);
    fixture.componentRef.setInput('title', 'Nuovo cliente');
    fixture.detectChanges();
    expect(el.querySelector('.modal__title')?.textContent?.trim()).toBe('Nuovo cliente');
  });

  it('should set aria-label from title', () => {
    fixture.componentRef.setInput('open',  true);
    fixture.componentRef.setInput('title', 'Modifica progetto');
    fixture.detectChanges();
    expect(el.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Modifica progetto');
  });

  // --- Size ---

  it('should apply md size class by default', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(el.querySelector('.modal')?.classList).toContain('modal--md');
  });

  it('should apply lg size class when size=lg', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.querySelector('.modal')?.classList).toContain('modal--lg');
  });

  it('should apply sm size class when size=sm', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(el.querySelector('.modal')?.classList).toContain('modal--sm');
  });

  // --- Chiusura ---

  it('should emit closed when close button is clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    let emitted = false;
    component.closed.subscribe(() => emitted = true);
    el.querySelector<HTMLButtonElement>('.modal__close')?.click();
    expect(emitted).toBe(true);
  });

  it('should emit closed when overlay is clicked', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    let emitted = false;
    component.closed.subscribe(() => emitted = true);
    el.querySelector<HTMLElement>('.modal-overlay')?.click();
    expect(emitted).toBe(true);
  });

  it('should not emit closed when clicking inside modal content', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    let emitted = false;
    component.closed.subscribe(() => emitted = true);
    el.querySelector<HTMLElement>('.modal')?.click();
    expect(emitted).toBe(false);
  });

  it('should emit closed on Escape key when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    let emitted = false;
    component.closed.subscribe(() => emitted = true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(emitted).toBe(true);
  });

  it('should not emit closed on Escape key when closed', () => {
    let emitted = false;
    component.closed.subscribe(() => emitted = true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(emitted).toBe(false);
  });

});
