import { readEnvVar } from './read-env-var.util';

export function getBooleanEnvVar(name: string): boolean {
  const value = readEnvVar(name);
  if (!value) {
    return false;
  }
  return value.toLowerCase() === 'true';
}
