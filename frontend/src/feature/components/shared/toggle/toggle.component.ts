import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector:    'app-toggle',
  standalone:  true,
  templateUrl: './toggle.component.html',
  styleUrl:    './toggle.component.scss',
  providers: [{
    provide:     NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi:       true,
  }],
})
export class ToggleComponent implements ControlValueAccessor {
  readonly label    = input<string>('');
  readonly hint     = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly checked  = signal(false);
  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: ()        => void   = () => {};

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this._onChange(next);
    this._onTouched();
  }

  writeValue(v: boolean): void        { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void  { this._onChange  = fn; }
  registerOnTouched(fn: () => void): void           { this._onTouched = fn; }
}
