/// <reference types="node" />
import { EnvSchema, EnvType } from './types';
interface Options {
    path?: string;
    encoding?: BufferEncoding;
    overrideProcessEnv?: boolean;
}
/**
 * Loads .env from the working directory, merges it with process.env (which takes precedence),
 * validates against the provided schema, and coerces to the corresponding types.
 *
 * @param schema - Mapping from variable names to desired types
 * @param path - Custom path, also resolved relative to working directory
 *
 * @throws EnvError
 */
export declare function load<S extends EnvSchema>(schema: S, path?: string): EnvType<S>;
/**
 *
 * Loads .env from the working directory, merges it with process.env, validates against the
 * provided schema, and coerces to the corresponding types. May specify via options: a different
 * .env path; file encoding; whether .env overrides values from process.env.
 *
 * @param schema - Mapping from variable names to desired types
 * @param options - Options object
 *
 * @throws EnvError
 */
export declare function load<S extends EnvSchema>(schema: S, options?: Options): EnvType<S>;
export {};
