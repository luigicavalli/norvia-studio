import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';


describe('DatepickerComponent', () => {

  let fixture:   ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;
  let el:        HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent],
    }).compileComponents();

    fixture   = TestBed.createComponent(DatepickerComponent);
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
    fixture.componentRef.setInput('label', 'Data di nascita');
    fixture.detectChanges();
    expect(el.querySelector('.dp-label')?.textContent?.trim()).toBe('Data di nascita');
  });

  it('should not render label when empty', () => {
    expect(el.querySelector('.dp-label')).toBeNull();
  });

  it('should associate label with input via for/id', () => {
    fixture.componentRef.setInput('label', 'Data');
    fixture.detectChanges();
    const labelFor = el.querySelector('label')?.getAttribute('for');
    const inputId  = el.querySelector('.dp-input')?.id;
    expect(labelFor).toBe(inputId);
  });

  // --- Calendar apri/chiudi ---

  it('should be closed by default', () => {
    expect(el.querySelector('.dp-calendar')).toBeNull();
  });

  it('should open calendar on icon button click', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.dp-calendar')).toBeTruthy();
  });

  it('should close calendar on second icon button click', () => {
    const btn = el.querySelector<HTMLButtonElement>('.dp-icon-btn')!;
    btn.click(); fixture.detectChanges();
    btn.click(); fixture.detectChanges();
    expect(el.querySelector('.dp-calendar')).toBeNull();
  });

  it('should close calendar on Escape key', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    el.querySelector<HTMLInputElement>('.dp-input')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.dp-calendar')).toBeNull();
  });

  // --- Vista ---

  it('should show day view by default when opening', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();
    expect(el.querySelector('.dp-days')).toBeTruthy();
    expect(el.querySelector('.dp-month-grid')).toBeNull();
  });

  it('should switch to month view on month name click', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const [monthBtn] = el.querySelectorAll<HTMLButtonElement>('.dp-header__btn');
    monthBtn.click();
    fixture.detectChanges();

    expect(el.querySelector('.dp-month-grid')).toBeTruthy();
    expect(el.querySelector('.dp-days')).toBeNull();
  });

  it('should switch to year view on year click', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const btns = el.querySelectorAll<HTMLButtonElement>('.dp-header__btn');
    btns[1].click(); // anno
    fixture.detectChanges();

    expect(el.querySelector('.dp-year-grid')).toBeTruthy();
  });

  it('should switch from month view to year view on year click', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();
    el.querySelectorAll<HTMLButtonElement>('.dp-header__btn')[0].click(); // mese
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.dp-header__btn')?.click(); // anno in month view
    fixture.detectChanges();
    expect(el.querySelector('.dp-year-grid')).toBeTruthy();
  });

  // --- Navigazione mesi ---

  it('should navigate to previous month', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const initialHeader = el.querySelectorAll('.dp-header__btn')[0].textContent?.trim();
    el.querySelectorAll<HTMLButtonElement>('.dp-nav')[0].click(); // freccia sinistra
    fixture.detectChanges();

    const newHeader = el.querySelectorAll('.dp-header__btn')[0].textContent?.trim();
    expect(newHeader).not.toBe(initialHeader);
  });

  it('should navigate to next month', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const initialHeader = el.querySelectorAll('.dp-header__btn')[0].textContent?.trim();
    el.querySelectorAll<HTMLButtonElement>('.dp-nav')[1].click(); // freccia destra
    fixture.detectChanges();

    const newHeader = el.querySelectorAll('.dp-header__btn')[0].textContent?.trim();
    expect(newHeader).not.toBe(initialHeader);
  });

  // --- Selezione giorno ---

  it('should select a day, close calendar and set input value', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const firstDay = el.querySelector<HTMLButtonElement>('.dp-day')!;
    firstDay.click();
    fixture.detectChanges();

    expect(el.querySelector('.dp-calendar')).toBeNull();
    const inputValue = (el.querySelector('.dp-input') as HTMLInputElement).value;
    expect(inputValue).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('should mark selected day', () => {
    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.dp-day')?.click();
    fixture.detectChanges();

    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    expect(el.querySelector('.dp-day--selected')).toBeTruthy();
  });

  // --- Input manuale (mask) ---

  it('should format typed digits with slashes', () => {
    const input = el.querySelector('.dp-input') as HTMLInputElement;
    input.value = '25042026';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('25/04/2026');
  });

  it('should add first slash after 2 digits', () => {
    const input = el.querySelector('.dp-input') as HTMLInputElement;
    input.value = '25';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('25');

    input.value = '250';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('25/0');
  });

  it('should parse valid manual date and sync calendar', () => {
    const input = el.querySelector('.dp-input') as HTMLInputElement;
    input.value = '01012000';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('01/01/2000');

    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();

    const yearBtn = el.querySelectorAll<HTMLButtonElement>('.dp-header__btn')[1];
    expect(yearBtn.textContent?.trim()).toBe('2000');
  });

  // --- ControlValueAccessor ---

  it('should set value via writeValue and display formatted date', () => {
    component.writeValue(new Date(2026, 3, 22)); // 22 aprile 2026
    fixture.detectChanges();
    expect((el.querySelector('.dp-input') as HTMLInputElement).value).toBe('22/04/2026');
  });

  it('should call onChange when day is selected', () => {
    let changed: Date | null = null;
    component.registerOnChange((v) => changed = v);

    el.querySelector<HTMLButtonElement>('.dp-icon-btn')?.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.dp-day')?.click();

    expect(changed).toBeInstanceOf(Date);
  });

  it('should clear value when writeValue called with null', () => {
    component.writeValue(new Date());
    fixture.detectChanges();
    component.writeValue(null);
    fixture.detectChanges();
    expect((el.querySelector('.dp-input') as HTMLInputElement).value).toBe('');
  });

  it('should disable input via setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect((el.querySelector('.dp-input') as HTMLInputElement).disabled).toBe(true);
  });

  // --- Messaggi ---

  it('should show error message when error=true', () => {
    fixture.componentRef.setInput('error',        true);
    fixture.componentRef.setInput('errorMessage', 'Data non valida');
    fixture.detectChanges();
    expect(el.querySelector('.dp-message--error')?.textContent?.trim()).toBe('Data non valida');
  });

  it('should show hint when no error', () => {
    fixture.componentRef.setInput('hint', 'Formato: gg/mm/aaaa');
    fixture.detectChanges();
    expect(el.querySelector('.dp-message')?.textContent?.trim()).toBe('Formato: gg/mm/aaaa');
  });

});
