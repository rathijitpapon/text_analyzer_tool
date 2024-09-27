export const allLogTypes = [
    'SUCCESS',
    'WARN',
    'ERROR',
    'INFO',
    'DEBUG'
] as const;

export type LogType = typeof allLogTypes[number];

export interface Logger {
    write: (...params: unknown[]) => Promise<void>;
}