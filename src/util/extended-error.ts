export class ExtendedError extends Error {
    response?: any
    shouldRedirect?: boolean
    statusCode?: number
    constructor(message?: string) {
        super(message);
    }
}