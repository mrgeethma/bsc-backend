export const ERROR_MESSAGES = {
    // General Error Messages
    INTERNAL_SERVER_ERROR: 'Internal server error occurred.',
    VALIDATION_FAILED: 'Validation failed.',
    UNAUTHORIZED_ACCESS: 'Unauthorized access.',
    FORBIDDEN_ACCESS: 'Access forbidden.',
    INVALID_REQUEST: 'Invalid request.',
    OPERATION_FAILED: 'Operation failed.',
    DATA_NOT_FOUND: 'Data not found.',
    FETCH_FAILED: 'Failed to fetch data.',
    DATABASE_ERROR: 'Database operation failed.',

    // Product Related Error Messages (nested structure for consistency)
    PRODUCT: {
        NOT_FOUND: 'Product not found.',
        ALREADY_EXISTS: 'Product already exists.',
        CREATION_FAILED: 'Failed to create product.',
        UPDATE_FAILED: 'Failed to update product.',
        DELETE_FAILED: 'Failed to delete product.',
        RETRIEVAL_FAILED: 'Failed to retrieve products.',
        INVALID_ID: 'Invalid product ID.',
        SAVE_FAILED: 'Failed to save product data.'
    },

    // Legacy flat structure for backward compatibility
    PRODUCT_NOT_FOUND: 'Product not found.',
    PRODUCT_ALREADY_EXISTS: 'Product already exists.',
    PRODUCT_CREATION_FAILED: 'Failed to create product.',
    PRODUCT_UPDATE_FAILED: 'Failed to update product.',
    PRODUCT_DELETE_FAILED: 'Failed to delete product.',
    PRODUCT_RETRIEVAL_FAILED: 'Failed to retrieve products.',
    INVALID_PRODUCT_ID: 'Invalid product ID.',
    PRODUCT_SAVE_FAILED: 'Failed to save product data.',

    // Category Related Error Messages
    CATEGORY_NOT_FOUND: 'Category not found.',
    CATEGORY_INACTIVE: 'Category is not active.',

    // SKU Related Error Messages
    SKU_ALREADY_EXISTS: 'Product with this SKU already exists.',

    // Slug Related Error Messages
    SLUG_ALREADY_EXISTS: 'Product with this name already exists.',
};