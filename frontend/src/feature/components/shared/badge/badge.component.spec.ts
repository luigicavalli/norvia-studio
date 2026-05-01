import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeComponent } from './badge.component';


describe('BadgeComponent', () => {

  let fixture:   ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.componentRef.setInput('label', 'Attivo');
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Label ---

  it('should render label', () => {
    expect(el.querySelector('.badge')?.textContent?.trim()).toBe('Attivo');
  });

  it('should update when label changes', () => {
    fixture.componentRef.setInput('label', 'Inattivo');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.textContent?.trim()).toBe('Inattivo');
  });

  // --- Variant ---

  it('should apply default variant class', () => {
    expect(el.querySelector('.badge')?.classList).toContain('badge--default');
  });

  it('should apply success variant class', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.classList).toContain('badge--success');
  });

  it('should apply danger variant class', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.classList).toContain('badge--danger');
  });

  it('should apply warning variant class', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.classList).toContain('badge--warning');
  });

  it('should apply info variant class', () => {
    fixture.componentRef.setInput('variant', 'info');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.classList).toContain('badge--info');
  });

  // --- Size ---

  it('should apply default size class (md)', () => {
    expect(el.querySelector('.badge')?.classList).toContain('badge--md');
  });

  it('should apply sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.classList).toContain('badge--sm');
  });

});
