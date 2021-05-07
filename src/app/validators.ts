import { AbstractControl, ValidationErrors } from '@angular/forms';
import { cnpj as cnpjValidator, cpf as cpfValidator } from 'cpf-cnpj-validator';
import telefone from 'telefone';  

export function cnpj(control: AbstractControl): ValidationErrors | null {
  if (!cnpjValidator.isValid(control.value)) return { cnpj: true };
  return null;
}

export function cpf(control: AbstractControl): ValidationErrors | null {
  if (!cpfValidator.isValid(control.value)) return { cpf: true };
  return null;
}

export function cep(control: AbstractControl): ValidationErrors | null {
  const cep = control.value + '';

  const validatingExp = /\d{5}-\d{3}/;
  if (!cep.match(validatingExp)) return { cep: true };
  return null;
}

export function cellphone(control: AbstractControl): ValidationErrors | null {
  const isValid = Boolean(telefone.parse(control.value, { apenasCelular: true }));

  if (!isValid) return { cellphoneNumber: true };
  return null;
}

export function phone(control: AbstractControl): ValidationErrors | null {
  const isValid = Boolean(telefone.parse(control.value, { apenasFixo: true }));

  if (!isValid) return { phoneNumber: true };

  return null;
}