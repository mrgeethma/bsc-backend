export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    errors?: ValidationErrorItem[];
}

export interface ValidationErrorItem {
    field?: string;
    messages: string[];
}

export class ResponseUtil {
    static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
        return { success: true, statusCode, message, data };
    }

    static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
        return this.success(data, message, 201);
    }

    static ok<T>(data: T, message = 'Request successful'): ApiResponse<T> {
        return this.success(data, message, 200);
    }

    static fail<T = null>(
        message = 'Request failed',
        statusCode = 400,
        errors?: ValidationErrorItem[]
    ): ApiResponse<T> {
        return { success: false, statusCode, message, data: null, errors };
    }

    static unauthorized(message = 'Unauthorized access.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 401, errors);
    }

    static forbidden(message = 'Forbidden access.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 403, errors);
    }

    static notFound(message = 'Resource not found.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 404, errors);
    }

    static conflict(message = 'Resource already exists.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 409, errors);
    }

    static internalServerError(message = 'Internal server error.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 500, errors);
    }
}
