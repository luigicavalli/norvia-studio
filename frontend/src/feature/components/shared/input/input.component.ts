/**
 * -------
 * ANGULAR
 * -------
 */
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR }        from '@angular/forms';

/**
 * -----
 * TYPES
 * -----
 */
import { InputColor, InputSize, InputType } from './input.types';


let nextId = 0;

@Component({
  selector:    'app-input',
  styleUrl:    './input.component.scss',
  templateUrl: './input.component.html',
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi:       true,
  }],
})
export class InputComponent implements ControlValueAccessor {

  public readonly label        = input<string>('');
  public readonly placeholder  = input<string>('');
  public readonly type         = input<InputType>('text');
  public readonly size         = input<InputSize>('md');
  public readonly color        = input<InputColor>('primary');
  public readonly hint         = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly error        = input<boolean>(false);
  public readonly readOnly     = input<boolean>(false);

  protected readonly inputId      = `app-input-${++nextId}`;
  protected readonly value        = signal<string>('');
  protected readonly isDisabled   = signal<boolean>(false);
  protected readonly showPassword = signal<boolean>(false);

  protected readonly effectiveType = computed(() =>
    this.type() === 'password' && this.showPassword() ? 'text' : this.type()
  );

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected readonly containerClasses = computed(() => [
    `inp--${this.size()}`,
    `inp--${this.color()}`,
    this.error()      ? 'inp--error'    : '',
    this.isDisabled() ? 'inp--disabled' : '',
  ].filter(Boolean).join(' '));

  private   onChange:  (v: string) => void = () => {};
  protected onTouched: ()          => void = () => {};

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

}
