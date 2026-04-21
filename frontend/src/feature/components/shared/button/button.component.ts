/**
 * -------
 * ANGULAR
 * -------
 */
import { Component, computed, input, output } from '@angular/core';

/**
 * -----
 * TYPES
 * -----
 */
import { ButtonColor, ButtonSize, ButtonType, ButtonVariant } from './button.types';


@Component({
  selector:    'app-button',
  styleUrl:    './button.component.scss',
  templateUrl: './button.component.html',
})
export class ButtonComponent {

  public readonly label     = input<string>('');
  public readonly size      = input<ButtonSize>("md");
  public readonly variant   = input<ButtonVariant>("default");
  public readonly type      = input<ButtonType>("button");
  public readonly color     = input<ButtonColor>("primary");
  public readonly disabled  = input<boolean>(false);
  public readonly loading   = input<boolean>(false);
  public readonly iconOnly  = input<boolean>(false);
  public readonly ariaLabel = input<string>();
  public readonly width     = input<string>();
  public readonly height    = input<string>();

  public readonly clicked = output<void>();

  protected readonly classes = computed(() => [
    `btn--${this.variant()}`,
    `btn--${this.size()}`,
    `btn--${this.color()}`,
    this.iconOnly() ? 'btn--icon-only' : '',
  ].filter(Boolean).join(' '));

}
