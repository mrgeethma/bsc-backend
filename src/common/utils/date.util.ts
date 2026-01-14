/**
 * Utility class for date/time operations and timezone conversions
 */
export class DateUtil {
  /**
   * Convert a Date object to Sri Lankan time (Asia/Colombo timezone)
   * @param date - The date to convert
   * @returns The date formatted in Sri Lankan timezone
   */
  static toSriLankanTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleString('en-LK', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    });
  }

  /**
   * Convert a Date object to Sri Lankan time in ISO-like format
   * @param date - The date to convert
   * @returns The date in ISO-like format with Sri Lankan timezone
   */
  static toSriLankanTimeISO(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Convert to Sri Lankan time and format as ISO-like string
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('sv-SE', options); // sv-SE gives YYYY-MM-DD HH:mm:ss format
    return formatter.format(dateObj);
  }

  /**
   * Transform an object by converting specified date fields to Sri Lankan time
   * @param obj - The object containing date fields
   * @param dateFields - Array of field names that contain dates to convert
   * @returns New object with converted date fields
   */
  static transformDateFields<T extends Record<string, any>>(
    obj: T,
    dateFields: (keyof T)[] = ['createdAt', 'updatedAt'], //what this line does is it defines a default value for the dateFields parameter. If no specific fields are provided when calling the function, it will default to transforming the createdAt and updatedAt fields of the object.(//what is keyof T does is it represents the keys of the type T which means it ensures that the dateFields array only contains valid keys that exist on the object T which are typically date fields like createdAt and updatedAt.)
  ): T {
    const transformed = { ...obj };

    dateFields.forEach((field) => {
      const fieldValue = transformed[field];
      if (fieldValue && this.isDateLike(fieldValue)) {
        transformed[field] = this.toSriLankanTimeISO(fieldValue) as T[keyof T];
      }
    });

    return transformed;
  }

  /**
   * Check if a value is date-like (Date object or string)
   * @param value - The value to check
   * @returns True if the value is a Date or string
   */
  private static isDateLike(value: any): value is Date | string {
    return value instanceof Date || typeof value === 'string';
  }

  /**
   * Transform an array of objects by converting specified date fields to Sri Lankan time
   * @param objects - Array of objects containing date fields
   * @param dateFields - Array of field names that contain dates to convert
   * @returns New array with objects having converted date fields
   */
  static transformArrayDateFields<T extends Record<string, any>>(
    objects: T[],
    dateFields: (keyof T)[] = ['createdAt', 'updatedAt'],
  ): T[] {
    return objects.map((obj) => this.transformDateFields(obj, dateFields));
  }
}
