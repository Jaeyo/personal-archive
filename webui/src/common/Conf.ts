export const env = (): string | undefined => process.env.NODE_ENV

export const isDev = (): boolean => env() === 'development'
