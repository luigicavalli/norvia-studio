import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';


describe('AvatarComponent', () => {

  let fixture:   ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Initials ---

  it('should show initials for two-word name', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    expect(el.querySelector('.avatar--initials')?.textContent?.trim()).toBe('MR');
  });

  it('should uppercase initials', () => {
    fixture.componentRef.setInput('name', 'luigi cavalli');
    fixture.detectChanges();
    expect(el.querySelector('.avatar--initials')?.textContent?.trim()).toBe('LC');
  });

  it('should use first and last word for three-word names', () => {
    fixture.componentRef.setInput('name', 'Mario De Rossi');
    fixture.detectChanges();
    expect(el.querySelector('.avatar--initials')?.textContent?.trim()).toBe('MR');
  });

  it('should use single letter for single-word name', () => {
    fixture.componentRef.setInput('name', 'Mario');
    fixture.detectChanges();
    expect(el.querySelector('.avatar--initials')?.textContent?.trim()).toBe('M');
  });

  it('should show ? for empty name', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(el.querySelector('.avatar--initials')?.textContent?.trim()).toBe('?');
  });

  // --- Image ---

  it('should render img when imageUrl is provided', () => {
    fixture.componentRef.setInput('name',     'Mario Rossi');
    fixture.componentRef.setInput('imageUrl', 'https://example.com/avatar.jpg');
    fixture.detectChanges();
    const img = el.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('avatar.jpg');
  });

  it('should show initials when imageUrl is null', () => {
    fixture.componentRef.setInput('name',     'Mario Rossi');
    fixture.componentRef.setInput('imageUrl', null);
    fixture.detectChanges();
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.avatar--initials')).toBeTruthy();
  });

  it('should set alt attribute to name on img', () => {
    fixture.componentRef.setInput('name',     'Mario Rossi');
    fixture.componentRef.setInput('imageUrl', 'https://example.com/avatar.jpg');
    fixture.detectChanges();
    expect(el.querySelector('img')?.alt).toBe('Mario Rossi');
  });

  // --- Size ---

  it('should apply default size class (md)', () => {
    expect(el.querySelector('.avatar')?.classList).toContain('avatar--md');
  });

  it('should apply custom size class', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    expect(el.querySelector('.avatar')?.classList).toContain('avatar--xl');
  });

});
