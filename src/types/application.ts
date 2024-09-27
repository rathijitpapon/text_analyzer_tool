export const ApplicationModes: Record<string, string> = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TEST: 'test',
} as const;

export const applicationModes = ['production', 'development', 'test'] as const;

export type ApplicationMode = typeof applicationModes[number];