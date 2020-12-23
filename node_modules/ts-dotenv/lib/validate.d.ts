import { Env, EnvSchema } from './types';
export declare type ValidatedEnv = {
    [key: string]: string;
};
export declare function validate(schema: EnvSchema, env: Env): asserts env is ValidatedEnv;
