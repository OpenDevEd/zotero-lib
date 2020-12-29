"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerce = void 0;
const normalize_1 = require("./normalize");
function coerce(schema, env) {
    const coerced = {};
    for (const [key, schemaValue] of Object.entries(schema)) {
        const value = env[key];
        const config = normalize_1.normalize(schemaValue);
        if (config.default !== undefined && (value === '' || value === undefined)) {
            coerced[key] = config.default;
            continue;
        }
        if (config.optional && value === undefined) {
            coerced[key] = undefined;
            continue;
        }
        if (config.type === Boolean) {
            coerced[key] = value === 'true';
            continue;
        }
        if (config.type === Buffer) {
            coerced[key] = Buffer.from(value, 'base64');
            continue;
        }
        if (config.type === Number) {
            coerced[key] = parseInt(value, 10);
            continue;
        }
        coerced[key] = value;
    }
    return coerced;
}
exports.coerce = coerce;
//# sourceMappingURL=coerce.js.map