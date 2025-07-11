import { readEnvVar } from './read-env-var.util';

export function getEnvVar(name: string) {
  const envVar = readEnvVar(name);
  if (!envVar) {
    throw new Error(`getEnvVar not found: '${name}'`);
  }
  return envVar;
}
