import { EnvKeyConfig } from './types';
export declare enum EnvErrorType {
    MISSING = "MISSING",
    WRONG_TYPE = "WRONG_TYPE"
}
export declare type EnvErrorReport = {
    [key: string]: {
        type: EnvErrorType;
        config: EnvKeyConfig;
        receivedValue?: string;
    };
};
export declare class EnvError extends Error {
    readonly name: string;
    readonly report: EnvErrorReport;
    constructor(report: EnvErrorReport);
}
