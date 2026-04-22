import { Component }    from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent }   from '../shared/toast/toast.component';


@Component({
  selector:    'app-shell',
  standalone:  true,
  imports:     [RouterOutlet, SidebarComponent, ToastComponent],
  templateUrl: './shell.component.html',
  styleUrl:    './shell.component.scss',
})
export class ShellComponent {}
