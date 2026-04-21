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
import { SelectColor, SelectOption, SelectSize } from './select.types';


let nextId = 0;

@Component({
  selector:    'app-select',
  styleUrl:    './select.component.scss',
  templateUrl: './select.component.html',
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi:       true,
  }],
})
export class SelectComponent implements ControlValueAccessor {

  public readonly label        = input<string>('');
  public readonly options      = input<SelectOption[]>([]);
  public readonly placeholder  = input<string>('Seleziona...');
  public readonly size         = input<SelectSize>('md');
  public readonly color        = input<SelectColor>('primary');
  public readonly hint         = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly error        = input<boolean>(false);

  protected readonly selectId     = `app-select-${++nextId}`;
  protected readonly value        = signal<string | number | null>(null);
  protected readonly isDisabled   = signal<boolean>(false);
  protected readonly isOpen       = signal<boolean>(false);
  protected readonly focusedIndex = signal<number>(-1);

  protected readonly selectedLabel = computed(() =>
    this.options().find(o => o.value === this.value())?.label ?? null
  );

  protected readonly containerClasses = computed(() => [
    `sel--${this.size()}`,
    `sel--${this.color()}`,
    this.error()      ? 'sel--error'    : '',
    this.isDisabled() ? 'sel--disabled' : '',
    this.isOpen()     ? 'sel--open'     : '',
  ].filter(Boolean).join(' '));

  private readonly elementRef = inject(ElementRef);
  private _onChange: (v: string | number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  protected toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    this.isOpen.set(true);
    const currentIndex = this.options().findIndex(o => o.value === this.value());
    this.focusedIndex.set(currentIndex);
  }

  protected close(): void {
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  protected selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this._onChange(option.value);
    this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const opts = this.options();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) { this.open(); break; }
        this.focusedIndex.update(i => Math.min(i + 1, opts.length - 1));
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) { this.open(); break; }
        this.focusedIndex.update(i => Math.max(i - 1, 0));
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) { this.open(); break; }
        const focused = opts[this.focusedIndex()];
        if (focused) this.selectOption(focused);
        break;

      case 'Escape':
      case 'Tab':
        this.close();
        break;
    }
  }

  writeValue(value: string | number | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (v: string | number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

}
