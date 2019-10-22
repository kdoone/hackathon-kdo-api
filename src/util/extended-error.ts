interface ErrorResponse {
    message: string;
    subject?: string;
}

export class ExtendedError extends Error {
    response?: ErrorResponse | string
    shouldRedirect?: boolean
    statusCode?: number
    constructor(message?: string) {
        super(message);
    }
}