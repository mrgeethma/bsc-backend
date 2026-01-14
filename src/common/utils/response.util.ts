//what is the purpose of this file? This file provides a utility class for standardizing API responses in a TypeScript application. It defines a generic interface for API responses and includes methods to create success and error responses with appropriate status codes and messages. This helps ensure consistent response structures across the application, making it easier to handle responses on the client side.
//first we define the ApiResponse interface which is a generic interface that standardizes the structure of API responses. It includes properties for success status, status code, message, data payload, and optional validation errors. why generic? because it can handle different types of data payloads while maintaining a consistent response format.

// function identity(arg: number): number {
//     return arg;
// }

//instead of above method we can use generics to make it more flexible as below

// function identity<T>(arg: T): T { 
//     return arg;
// }

export interface ApiResponse<T> { // Generic interface to standardize API responses. generic means it can work with any data type specified when the interface is used.
    success: boolean; 
    statusCode: number;
    message: string;
    data: T | null; // The data payload of the response, which can be of any type or null if there's no data.
    errors?: ValidationErrorItem[]; // Optional array to hold validation error details, if any.
}

export interface ValidationErrorItem { // Interface to represent validation error details.
    field?: string; // Optional field name that caused the validation error like "email" or "password".
    messages: string[]; // Array of error messages related to the validation failure like "must be a valid email" or "password is too short".
} 

export class ResponseUtil { // Utility class to create standardized API responses. here we define several static methods to generate different types of API responses, such as success, created, ok, fail, unauthorized, forbidden, notFound, conflict, and internalServerError. each method constructs an ApiResponse object with appropriate values based on the type of response being generated.
    static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> { // Method to create a successful API response. here it takes in the data payload, an optional message (defaulting to 'Success'), and an optional status code (defaulting to 200). it returns an ApiResponse object indicating a successful operation.
        return { success: true, statusCode, message, data }; // Constructing and returning the ApiResponse object. here success is set to true, and the provided statusCode, message, and data are included in the response.
    }

    static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
        return this.success(data, message, 201);
    }

    static ok<T>(data: T, message = 'Request successful'): ApiResponse<T> {
        return this.success(data, message, 200);
    }

    static fail<T = null>(message = 'Request failed', statusCode = 400, errors?: ValidationErrorItem[]): ApiResponse<T> { // Method to create a failed API response. here it takes in an optional message (defaulting to 'Request failed'), an optional status code (defaulting to 400), and an optional array of validation errors. it returns an ApiResponse object indicating a failed operation. why <T = null> because in failure cases, there might not be any data to return, so we default the generic type T to null and why here ApiResponse<T> because even in failure cases, we want to maintain the same response structure defined by the ApiResponse interface. this allows for consistency in how responses are formatted, regardless of whether the operation was successful or not.
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

    static negativeSuccess(message = 'Negative success.', errors?: ValidationErrorItem[]): ApiResponse<null> {
        return this.fail(message, 200, errors = []);
    }
}
