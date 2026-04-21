/**
 * -------
 * ANGULAR
 * -------
 */
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * -----
 * TYPES
 * -----
 */
import { CalendarView, DatepickerColor, DatepickerSize } from './datepicker.types';


let nextId = 0;

@Component({
  selector:    'app-datepicker',
  styleUrl:    './datepicker.component.scss',
  templateUrl: './datepicker.component.html',
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi:       true,
  }],
})
export class DatepickerComponent implements ControlValueAccessor {

  public readonly label        = input<string>('');
  public readonly placeholder  = input<string>('gg/mm/aaaa');
  public readonly size         = input<DatepickerSize>('md');
  public readonly color        = input<DatepickerColor>('primary');
  public readonly hint         = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly error        = input<boolean>(false);

  protected readonly datepickerId   = `app-datepicker-${++nextId}`;
  protected readonly inputValue     = signal<string>('');
  protected readonly selectedDate   = signal<Date | null>(null);
  protected readonly viewDate       = signal<Date>(new Date());
  protected readonly isDisabled     = signal<boolean>(false);
  protected readonly isOpen         = signal<boolean>(false);
  protected readonly calendarView   = signal<CalendarView>('day');
  protected readonly yearRangeStart = signal<number>(
    Math.floor(new Date().getFullYear() / 12) * 12
  );

  protected readonly WEEKDAYS = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'];
  protected readonly MONTHS   = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  protected readonly viewMonthName = computed(() => this.MONTHS[this.viewDate().getMonth()]);
  protected readonly viewYear      = computed(() => this.viewDate().getFullYear());
  protected readonly yearRange     = computed(() =>
    Array.from({ length: 12 }, (_, i) => this.yearRangeStart() + i)
  );

  protected readonly calendarDays = computed(() => {
    const date  = this.viewDate();
    const year  = date.getFullYear();
    const month = date.getMonth();

    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Lun = 0
    const daysInMonth  = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  });

  protected readonly containerClasses = computed(() => [
    `dp--${this.size()}`,
    `dp--${this.color()}`,
    this.error()      ? 'dp--error'    : '',
    this.isDisabled() ? 'dp--disabled' : '',
    this.isOpen()     ? 'dp--open'     : '',
  ].filter(Boolean).join(' '));

  private readonly elementRef = inject(ElementRef);
  private  _onChange:  (v: Date | null) => void = () => {};
  protected onTouched: ()               => void = () => {};

  // --- Click outside ---

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) this.close();
  }

  // --- Input ---

  protected onInput(event: Event): void {
    const el     = event.target as HTMLInputElement;
    const digits = el.value.replace(/\D/g, '').slice(0, 8);

    let formatted = digits;
    if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;

    this.inputValue.set(formatted);
    el.value = formatted;

    if (digits.length === 8) this.parseAndSet(formatted);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':    this.close(); break;
      case 'Enter':     this.parseAndSet(this.inputValue()); break;
      case 'ArrowDown': if (!this.isOpen()) this.open(); break;
    }
  }

  private parseAndSet(str: string): void {
    const parts = str.split('/');
    if (parts.length !== 3) return;

    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year || year < 1000) return;

    const date = new Date(year, month - 1, day);
    if (
      isNaN(date.getTime())            ||
      date.getDate()     !== day       ||
      date.getMonth()    !== month - 1 ||
      date.getFullYear() !== year
    ) return;

    this.selectedDate.set(date);
    this.viewDate.set(new Date(year, month - 1, 1));
    this.yearRangeStart.set(Math.floor(year / 12) * 12);
    this._onChange(date);
  }

  // --- Open / close ---

  protected toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    const sel = this.selectedDate();
    if (sel) {
      this.viewDate.set(new Date(sel.getFullYear(), sel.getMonth(), 1));
      this.yearRangeStart.set(Math.floor(sel.getFullYear() / 12) * 12);
    }
    this.calendarView.set('day');
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected setView(view: CalendarView): void {
    this.calendarView.set(view);
  }

  // --- Navigazione ---

  protected prevMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  protected prevYear(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear() - 1, d.getMonth(), 1));
  }

  protected nextYear(): void {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear() + 1, d.getMonth(), 1));
  }

  protected prevYearRange(): void {
    this.yearRangeStart.update(y => y - 12);
  }

  protected nextYearRange(): void {
    this.yearRangeStart.update(y => y + 12);
  }

  // --- Selezione ---

  protected selectDay(day: number): void {
    const v    = this.viewDate();
    const date = new Date(v.getFullYear(), v.getMonth(), day);
    this.selectedDate.set(date);
    this.inputValue.set(this.formatDate(date));
    this._onChange(date);
    this.close();
  }

  protected selectMonth(monthIndex: number): void {
    this.viewDate.set(new Date(this.viewDate().getFullYear(), monthIndex, 1));
    this.calendarView.set('day');
  }

  protected selectYear(year: number): void {
    this.viewDate.set(new Date(year, this.viewDate().getMonth(), 1));
    this.yearRangeStart.set(Math.floor(year / 12) * 12);
    this.calendarView.set('month');
  }

  // --- Helper stato ---

  protected isToday(day: number): boolean {
    const today = new Date();
    const view  = this.viewDate();
    return today.getDate()     === day
        && today.getMonth()    === view.getMonth()
        && today.getFullYear() === view.getFullYear();
  }

  protected isSelected(day: number): boolean {
    const sel  = this.selectedDate();
    const view = this.viewDate();
    return !!sel
        && sel.getDate()     === day
        && sel.getMonth()    === view.getMonth()
        && sel.getFullYear() === view.getFullYear();
  }

  protected isSelectedMonth(i: number): boolean {
    const sel = this.selectedDate();
    return !!sel && sel.getMonth() === i && sel.getFullYear() === this.viewYear();
  }

  protected isCurrentMonth(i: number): boolean {
    const t = new Date();
    return t.getMonth() === i && t.getFullYear() === this.viewYear();
  }

  protected isSelectedYear(year: number): boolean {
    return this.selectedDate()?.getFullYear() === year;
  }

  protected isCurrentYear(year: number): boolean {
    return new Date().getFullYear() === year;
  }

  // --- Utility ---

  private formatDate(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  }

  // --- ControlValueAccessor ---

  writeValue(value: Date | string | null): void {
    if (!value) {
      this.selectedDate.set(null);
      this.inputValue.set('');
      return;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return;
    this.selectedDate.set(date);
    this.inputValue.set(this.formatDate(date));
    this.viewDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

}
