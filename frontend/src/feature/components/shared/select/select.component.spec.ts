import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent }  from './select.component';
import { SelectOption }     from './select.types';


const MOCK_OPTIONS: SelectOption[] = [
  { label: 'Designer',  value: 'designer'  },
  { label: 'Developer', value: 'developer' },
  { label: 'Manager',   value: 'manager', disabled: true },
];

describe('SelectComponent', () => {

  let fixture:   ComponentFixture<SelectComponent>;
  let component: SelectComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    el        = fixture.nativeElement;
    fixture.componentRef.setInput('options', MOCK_OPTIONS);
    fixture.detectChanges();
  });

  // --- Creazione ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Label ---

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Ruolo');
    fixture.detectChanges();
    expect(el.querySelector('.sel-label')?.textContent?.trim()).toBe('Ruolo');
  });

  it('should not render label when empty', () => {
    expect(el.querySelector('.sel-label')).toBeNull();
  });

  // --- Placeholder ---

  it('should show placeholder by default', () => {
    expect(el.querySelector('.sel-trigger span')?.textContent?.trim()).toBe('Seleziona...');
  });

  it('should apply placeholder class when no value selected', () => {
    expect(el.querySelector('.sel-trigger__placeholder')).toBeTruthy();
  });

  // --- Dropdown ---

  it('should be closed by default', () => {
    expect(el.querySelector('.sel-dropdown')).toBeNull();
  });

  it('should open dropdown on trigger click', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.sel-dropdown')).toBeTruthy();
  });

  it('should close dropdown on second trigger click', () => {
    const trigger = el.querySelector<HTMLButtonElement>('.sel-trigger')!;
    trigger.click(); fixture.detectChanges();
    trigger.click(); fixture.detectChanges();
    expect(el.querySelector('.sel-dropdown')).toBeNull();
  });

  it('should render all options when open', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    const options = el.querySelectorAll('.sel-option');
    expect(options.length).toBe(MOCK_OPTIONS.length);
    expect(options[0].textContent?.trim()).toBe('Designer');
    expect(options[1].textContent?.trim()).toBe('Developer');
  });

  it('should mark disabled option', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    const options = el.querySelectorAll('.sel-option');
    expect(options[2].classList).toContain('sel-option--disabled');
  });

  // --- Selezione ---

  it('should select option, update trigger and close dropdown', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();

    el.querySelectorAll<HTMLElement>('.sel-option')[1].click();
    fixture.detectChanges();

    expect(el.querySelector('.sel-dropdown')).toBeNull();
    expect(el.querySelector('.sel-trigger span')?.textContent?.trim()).toBe('Developer');
  });

  it('should mark selected option', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    el.querySelectorAll<HTMLElement>('.sel-option')[0].click();
    fixture.detectChanges();

    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.sel-option--selected')?.textContent?.trim()).toBe('Designer');
  });

  it('should not select disabled option', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    el.querySelectorAll<HTMLElement>('.sel-option')[2].click();
    fixture.detectChanges();

    expect(el.querySelector('.sel-trigger span')?.textContent?.trim()).toBe('Seleziona...');
  });

  // --- ControlValueAccessor ---

  it('should set value via writeValue and show correct label', () => {
    component.writeValue('developer');
    fixture.detectChanges();
    expect(el.querySelector('.sel-trigger span')?.textContent?.trim()).toBe('Developer');
  });

  it('should call onChange when option selected', () => {
    let changed: string | number | null = null;
    component.registerOnChange((v) => changed = v);

    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    el.querySelectorAll<HTMLElement>('.sel-option')[0].click();

    expect(changed).toBe('designer');
  });

  it('should disable trigger via setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector<HTMLButtonElement>('.sel-trigger')?.disabled).toBe(true);
  });

  // --- Messaggi ---

  it('should show error message when error=true', () => {
    fixture.componentRef.setInput('error',        true);
    fixture.componentRef.setInput('errorMessage', 'Campo richiesto');
    fixture.detectChanges();
    expect(el.querySelector('.sel-message--error')?.textContent?.trim()).toBe('Campo richiesto');
  });

  it('should show hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Scegli un ruolo');
    fixture.detectChanges();
    expect(el.querySelector('.sel-message')?.textContent?.trim()).toBe('Scegli un ruolo');
  });

  // --- Keyboard ---

  it('should close dropdown on Escape key', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.sel-dropdown')).toBeTruthy();

    el.querySelector<HTMLButtonElement>('.sel-trigger')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.sel-dropdown')).toBeNull();
  });

  it('should open dropdown on ArrowDown key', () => {
    el.querySelector<HTMLButtonElement>('.sel-trigger')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.sel-dropdown')).toBeTruthy();
  });

});
