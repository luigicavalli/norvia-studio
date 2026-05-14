import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslatePipe, TranslateService }  from '@ngx-translate/core';
import { firstValueFrom }              from 'rxjs';
import { WorkspaceService }            from '../../../services/workspace.service';
import { AuthService }                 from '../../../services/auth.service';
import { ToastService }                from '../../components/shared/toast/toast.service';
import { InputComponent }              from '../../components/shared/input/input.component';
import { ButtonComponent }             from '../../components/shared/button/button.component';
import { SelectComponent }             from '../../components/shared/select/select.component';
// import { ToggleComponent }             from '../../components/shared/toggle/toggle.component';
import { BadgeComponent }              from '../../components/shared/badge/badge.component';
import { SelectOption }                from '../../components/shared/select/select.types';


@Component({
  selector:    'app-settings',
  standalone:  true,
  imports:     [ReactiveFormsModule, TranslatePipe, InputComponent, ButtonComponent, SelectComponent, /*ToggleComponent,*/ BadgeComponent],
  templateUrl: './settings.component.html',
  styleUrl:    './settings.component.scss',
})
export class SettingsComponent implements OnInit {

  protected readonly workspaceService = inject(WorkspaceService);
  private readonly  auth              = inject(AuthService);
  private readonly  toast             = inject(ToastService);
  private readonly  fb                = inject(FormBuilder);
  private readonly  translate         = inject(TranslateService);

  protected readonly workspaceSaving  = signal(false);
  protected readonly notifSaving      = signal(false);
  protected readonly languageSaving   = signal(false);

  constructor() {
    effect(() => {
      const ws = this.workspaceService.activeWorkspace();
      if (ws) {
        this.workspaceForm.patchValue({ name: ws.name, description: ws.description ?? '' });
      }
    });
  }

  protected readonly workspaceForm = this.fb.group({
    name:        ['', Validators.required],
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

  ngOnInit(): void {
    const prefs = this.auth.getPreferences();
    this.notifForm.patchValue({
      taskAssigned: prefs.taskAssigned,
      deadlines:    prefs.deadlines,
      comments:     prefs.comments,
      weeklyDigest: prefs.weeklyDigest,
    });
    this.appearanceForm.patchValue({ language: prefs.language });
  }

  protected async onSaveWorkspace(): Promise<void> {
    if (this.workspaceForm.invalid) { this.workspaceForm.markAllAsTouched(); return; }

    const id = this.workspaceService.activeId();
    if (!id) return;

    this.workspaceSaving.set(true);
    try {
      const { name, description } = this.workspaceForm.value;
      await this.workspaceService.update(id, name!, description ?? undefined);
      this.toast.success(this.translate.instant('SETTINGS.TOAST.WORKSPACE_SAVED'));
    } catch {
      this.toast.danger(this.translate.instant('SETTINGS.TOAST.WORKSPACE_SAVE_ERROR'));
    } finally {
      this.workspaceSaving.set(false);
    }
  }

  protected async onSaveLanguage(): Promise<void> {
    const lang = this.appearanceForm.value.language ?? 'it';
    this.languageSaving.set(true);
    try {
      await this.auth.savePreferences({ language: lang });
      await firstValueFrom(this.translate.use(lang));
      window.location.reload();
    } catch {
      this.toast.danger(this.translate.instant('SETTINGS.TOAST.LANGUAGE_SAVE_ERROR'));
      this.languageSaving.set(false);
    }
  }

  protected async onSaveNotifications(): Promise<void> {
    this.notifSaving.set(true);
    try {
      const v = this.notifForm.value;
      await this.auth.savePreferences({
        taskAssigned: v.taskAssigned ?? true,
        deadlines:    v.deadlines    ?? true,
        comments:     v.comments     ?? false,
        weeklyDigest: v.weeklyDigest ?? true,
        language:     this.appearanceForm.value.language ?? 'it',
      });
      this.toast.success(this.translate.instant('SETTINGS.TOAST.NOTIF_SAVED'));
    } catch {
      this.toast.danger(this.translate.instant('SETTINGS.TOAST.NOTIF_SAVE_ERROR'));
    } finally {
      this.notifSaving.set(false);
    }
  }

}
