"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
function normalize(schemaValue) {
    return 'type' in schemaValue
        ? {
            type: schemaValue.type,
            optional: 'optional' in schemaValue ? schemaValue.optional : true,
            default: 'default' in schemaValue ? schemaValue.default : undefined,
        }
        : {
            type: schemaValue,
            optional: false,
        };
}
exports.normalize = normalize;
//# sourceMappingURL=normalize.js.map