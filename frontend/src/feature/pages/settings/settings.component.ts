import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService }    from '../../components/shared/toast/toast.service';
import { InputComponent }  from '../../components/shared/input/input.component';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { SelectComponent } from '../../components/shared/select/select.component';
import { ToggleComponent } from '../../components/shared/toggle/toggle.component';
import { BadgeComponent }  from '../../components/shared/badge/badge.component';
import { SelectOption }    from '../../components/shared/select/select.types';


@Component({
  selector:    'app-settings',
  standalone:  true,
  imports:     [ReactiveFormsModule, InputComponent, ButtonComponent, SelectComponent, ToggleComponent, BadgeComponent],
  templateUrl: './settings.component.html',
  styleUrl:    './settings.component.scss',
})
export class SettingsComponent {

  private readonly toast = inject(ToastService);
  private readonly fb    = inject(FormBuilder);

  protected workspaceSaving = false;

  protected readonly workspaceForm = this.fb.group({
    name:        ['Il mio workspace', Validators.required],
    description: [''],
  });

  protected readonly notifForm = this.fb.group({
    taskAssigned:  [true],
    deadlines:     [true],
    comments:      [false],
    weeklyDigest:  [true],
  });

  protected readonly appearanceForm = this.fb.group({
    language: ['it'],
  });

  protected readonly languageOptions: SelectOption[] = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English'  },
  ];

  protected async onSaveWorkspace(): Promise<void> {
    if (this.workspaceForm.invalid) { this.workspaceForm.markAllAsTouched(); return; }
    this.workspaceSaving = true;
    await new Promise(r => setTimeout(r, 600));
    this.workspaceSaving = false;
    this.toast.success('Impostazioni workspace salvate.');
  }

  protected onSaveNotifications(): void {
    this.toast.success('Preferenze notifiche aggiornate.');
  }

}
