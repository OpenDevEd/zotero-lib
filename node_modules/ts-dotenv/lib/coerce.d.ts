import { EnvSchema, EnvType } from './types';
import { ValidatedEnv } from './validate';
export declare function coerce<S extends EnvSchema>(schema: S, env: ValidatedEnv): EnvType<S>;
