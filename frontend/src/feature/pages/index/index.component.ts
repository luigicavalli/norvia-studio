/**
 * -------
 * ANGULAR
 * -------
 */
import { Component } from "@angular/core";

/**
 * ----------
 * COMPONENTS
 * ----------
 */
import { ButtonComponent } from "../../components/shared/button/button.component";
import { InputComponent } from "../../components/shared/input/input.component";
import { SelectComponent } from "../../components/shared/select/select.component";
import { DatepickerComponent } from "../../components/shared/datepicker/datepicker.component";


@Component({
  selector:    'app-index',
  imports: [ButtonComponent, InputComponent, SelectComponent, DatepickerComponent],
  styleUrl:    './index.component.scss',
  templateUrl: './index.component.html'
})
export class IndexComponent {
  options = [
    { label: 'Designer',   value: 'designer' },
    { label: 'Developer',  value: 'developer' },
    { label: 'Manager',    value: 'manager', disabled: true },
  ];
};
