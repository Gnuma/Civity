import axios from "axios";
import {
  ___CHECK_USERNAME___,
  ___CHECK_EMAIL___,
  ___CHECK_PHONE___
} from "../store/endpoints";
import _ from "lodash";

export type ValidatorFunction = (data: any) => boolean | Promise<boolean>;

export interface Validator {
  warnings: string[];
  functions: ValidatorFunction[];
}

export interface ValidatorObject {
  [key: string]: Validator;
}

export interface ValidationFields {
  [key: string]: string | number | undefined;
}

export interface ValidationReject {
  [key: string]: string;
}

export const submit = (
  fields: ValidationFields,
  validators: ValidatorObject
): Promise<null | ValidationReject> =>
  new Promise(async (resolve, rejects) => {
    let valid = true;
    const validationResult: ValidationReject = {};
    for (const key in validators) {
      if (!validators.hasOwnProperty(key) || !fields.hasOwnProperty(key))
        continue;
      const { functions, warnings } = validators[key];
      const value = fields[key];
      for (let i = 0; i < Math.min(functions.length, warnings.length); i++) {
        try {
          if (await functions[i](value)) continue;
          else throw "Validation Failed";
        } catch (error) {
          validationResult[key] = warnings[i];
          valid = false;
          break;
        }
      }
    }
    if (valid) resolve();
    else rejects(validationResult);
  });

export const isNotEmpty: ValidatorFunction = value => {
  if (Array.isArray(value)) return value.length > 0;
  else return !!value;
};

export const isValidEmail: ValidatorFunction = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isISBN: ValidatorFunction = value => {
  try {
    if (parseInt(value) == value && value.length >= 10 && value.length <= 13)
      return true;
  } catch (error) {
    return false;
  }
  return false;
};

export const exist: ValidatorFunction = object => !!object;

export const isValidPhone: ValidatorFunction = value => {
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(value));
};

export const isNotUndefined: ValidatorFunction = x => x !== undefined;

export const isValidPrice: ValidatorFunction = x =>
  !isNaN(parseFloat(x)) && isFinite(x);

export const isAvailableUsername: ValidatorFunction = username =>
  axios.post(___CHECK_USERNAME___, {
    username
  });

export const isAvailableEmail: ValidatorFunction = email =>
  axios.post(___CHECK_EMAIL___, {
    email
  });
export const isAvailablePhone: ValidatorFunction = async phone => {
  try {
    const res = await axios.post(___CHECK_PHONE___, { phone });
    console.log(res);
    return true;
  } catch (error) {
    console.log({ error });
    return false;
  }
};

//Field length validators

export const usernameLengthValidator: ValidatorFunction = str =>
  str.length >= 4 && str.length <= 13;
export const emailLengthValidator: ValidatorFunction = str => str.length <= 254;
export const passwordLengthValidator: ValidatorFunction = str =>
  str.length >= 8 && str.length <= 128;
export const phoneLengthValidator: ValidatorFunction = str =>
  str.length >= 9 && str.length <= 11;
