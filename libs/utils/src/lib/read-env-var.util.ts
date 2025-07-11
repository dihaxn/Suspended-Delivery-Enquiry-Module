import { type CustomWindow } from '@cookers/models';

declare let window: CustomWindow;

export function readEnvVar(name: string) {
  console.warn('NX - ENV localstorage :', `${name} `);
  // WARNING: Get value from local storage is purely for DEVs to switch the env varible at run time. for eg: ON/OFF third party scripts
  const result = localStorage.getItem(name); console.warn('NX - ENV localstorage :', `${name} - ${result}`);
  if (result) {
    console.warn('NX - ENV localstorage :', `${name} - ${result}`);
    return result;
  }

  let value;

  if (window._env_) {
    value = window._env_[name];
  }
  if (!value) {
    value = process.env[name];
  }
  return value;
}
