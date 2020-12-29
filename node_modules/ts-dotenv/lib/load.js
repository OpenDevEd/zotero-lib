"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const fs_1 = require("fs");
const coerce_1 = require("./coerce");
const parse_1 = require("./parse");
const validate_1 = require("./validate");
function load(schema, pathOrOptions) {
    const { path = '.env', encoding = 'utf-8', overrideProcessEnv = false } = typeof pathOrOptions === 'string' ? { path: pathOrOptions } : pathOrOptions || {};
    const raw = loadDotEnv(path, encoding);
    const parsed = parse_1.parse(raw);
    const merged = overrideProcessEnv
        ? Object.assign(Object.assign({}, process.env), parsed) : Object.assign(Object.assign({}, parsed), process.env);
    validate_1.validate(schema, merged);
    return coerce_1.coerce(schema, merged);
}
exports.load = load;
function loadDotEnv(fileName, encoding) {
    try {
        return fs_1.readFileSync(fileName, encoding);
    }
    catch (_a) {
        return '';
    }
}
//# sourceMappingURL=load.js.map