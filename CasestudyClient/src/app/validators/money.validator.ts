import { AbstractControl } from '@angular/forms';

export function ValidateMoney(control: AbstractControl): { invalidMoney: boolean } | null {
  const MONEY_REGEXP = /^[0-9]*(\.[0-9]{0,2})?$/;
  return !MONEY_REGEXP.test(control.value) ? { invalidMoney: true } : null;
} // ValidatePhone
