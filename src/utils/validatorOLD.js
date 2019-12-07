import axios from "axios";
import {
  ___CHECK_USERNAME___,
  ___CHECK_EMAIL___,
  ___CHECK_PHONE___
} from "../store/endpoints";

export const submit = (fields, validators) =>
  new Promise(async (resolve, reject) => {
    let valid = true;
    for (key in fields) {
      const { functions, warnings } = validators[key];
      const value = fields[key].value;
      let localValid = true;
      for (let i = 0; i < functions.length; i++) {
        try {
          const res = await functions[i](value);
          console.log(res);
          if (res === true) {
            valid = false;
            localValid = false;
            fields[key] = {
              value,
              errorMessage: warnings[i]
            };
            break;
          }
        } catch (error) {
          console.log(error);
          valid = false;
          localValid = false;
          fields[key] = {
            value,
            errorMessage: warnings[i]
          };
          break;
        }
      }
      if (localValid) {
        fields[key] = {
          value,
          errorMessage: ""
        };
      }
    }
    if (valid) resolve(valid);
    else resolve(fields);
  });

export const isEmpty = value => {
  return !value;
};

export const isInvalidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !re.test(String(email).toLowerCase());
};

export const fieldCheck = (field, validator) => {
  const value = field.value;
  field.errorMessage = "";
  for (let i = 0; i < validator.functions.length; i++) {
    if (validator.functions[i](value)) {
      field.errorMessage = validator.warnings[i];
      break;
    }
  }
  return field;
};

export const isNotISBN = value => {
  try {
    if (parseInt(value) == value && value.length >= 10 && value.length <= 13)
      return false;
  } catch (error) {
    return true;
  }
  return true;
};

export const notExist = object => !object;

export const isInvalidPhone = value => {
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return !re.test(String(value));
};

export const getNumber = value => {
  let num = value.match(/\d/g);
  console.log(num);
  return num.join("");
};

export const isUsernameTaken = username =>
  axios.post(___CHECK_USERNAME___, {
    username
  });

export const isEmailTaken = email =>
  axios.post(___CHECK_EMAIL___, {
    email
  });

export const isPhoneTaken = phone =>
  axios.post(___CHECK_PHONE___, {
    phone
  });

export const isUndefined = x => x == undefined;
