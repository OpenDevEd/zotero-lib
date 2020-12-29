"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const EnvError_1 = require("./EnvError");
const normalize_1 = require("./normalize");
/**
 * Only allows exactly 'true' or 'false'
 */
const booleanRegExp = /^(true|false)$/;
/**
 * Matches base-64 encoded binary data; checks for proper padding
 */
const base64RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
/**
 * Only allows integers; crudely prevents values greater than MAX_SAFE_INTEGER.
 */
const numberRegExp = /^-?\d{1,15}$/;
function validate(schema, env) {
    const report = validateSchema(schema, env);
    if (report)
        throw new EnvError_1.EnvError(report);
}
exports.validate = validate;
function validateSchema(schema, env) {
    const report = {};
    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = normalize_1.normalize(schemaValue);
        if (!valueExists(value)) {
            if (!config.optional) {
                report[key] = {
                    type: EnvError_1.EnvErrorType.MISSING,
                    config,
                };
            }
        }
        else if (!typeMatches(config, value)) {
            report[key] = {
                type: EnvError_1.EnvErrorType.WRONG_TYPE,
                config,
                receivedValue: value,
            };
        }
    }
    return Object.values(report).some(value => value != null) ? report : null;
}
function valueExists(value) {
    return !(value === undefined || value === '');
}
function typeMatches(config, value) {
    if (config.type === Boolean)
        return booleanRegExp.test(value);
    if (config.type === Buffer)
        return base64RegExp.test(value);
    if (config.type === Number)
        return numberRegExp.test(value);
    if (config.type instanceof Array)
        return config.type.includes(value);
    if (config.type instanceof RegExp)
        return config.type.test(value);
    return true;
}
//# sourceMappingURL=validate.js.map