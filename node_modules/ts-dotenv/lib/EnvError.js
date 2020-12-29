"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvError = exports.EnvErrorType = void 0;
var EnvErrorType;
(function (EnvErrorType) {
    EnvErrorType["MISSING"] = "MISSING";
    EnvErrorType["WRONG_TYPE"] = "WRONG_TYPE";
})(EnvErrorType = exports.EnvErrorType || (exports.EnvErrorType = {}));
class EnvError extends Error {
    constructor(report) {
        super(formatReport(report));
        this.name = 'EnvError';
        this.report = report;
    }
}
exports.EnvError = EnvError;
function formatReport(report) {
    const errors = Object.entries(report).map(entry => {
        const [key, { type, config, receivedValue }] = entry;
        return formatError(key, type, config, receivedValue);
    });
    return `Invalid or missing environment variables\n    - ${errors.join('\n    - ')}\n`;
}
function formatError(key, type, config, value) {
    switch (type) {
        case EnvErrorType.MISSING:
            return `Expected value for key '${key}'; none found`;
        case EnvErrorType.WRONG_TYPE:
            if (config.type instanceof RegExp) {
                return `Expected value for key '${key}' to match ${config.type}; got '${value}'`;
            }
            if (config.type instanceof Array) {
                const expectedValues = config.type.map(value => `'${value}'`).join(' | ');
                return `Expected value for key '${key}' to be one of ${expectedValues}; got '${value}'`;
            }
            return `Expected value for key '${key}' of type ${config.type.name}; got '${value}'`;
    }
}
//# sourceMappingURL=EnvError.js.map