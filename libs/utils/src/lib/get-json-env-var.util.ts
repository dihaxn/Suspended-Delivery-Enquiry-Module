import { getEnvVar } from './get-env-var.util';

export const getJsonEnvVar = (name: string) => JSON.parse(getEnvVar(name));
