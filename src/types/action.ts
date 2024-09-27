export interface Action {
    execute: (...params: unknown[]) => Promise<unknown> | AsyncGenerator<unknown>;
}