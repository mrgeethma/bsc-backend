import { Controller, Get, Post } from '@nestjs/common'; // importing necessary decorators and modules from NestJS common package
import type { ApiResponse } from './common/utils/response.util'; // importing the ApiResponse type from a utility file to standardize API responses. it helps ensure consistent response structures across the application.
import { ResponseUtil } from './common/utils/response.util'; // importing a utility class for creating standardized API responses and it provides methods to generate success and error responses and maintain consistency in how responses are formatted.

@Controller() // base route for this controller is '/'.
export class AppController {
  constructor() {} // No dependencies to inject here because this controller is simple. But we keep the constructor for consistency

  @Get('health-check')
  check(): ApiResponse<{ status: string }> {
    // method to handle GET requests to /health-check. here ApiResponse<{ status: string }> indicates that the method returns a standardized API response containing an object with a status property of type string. this helps ensure consistency in how responses are structured across the API. Here we are defining the structure of the response data.
    return ResponseUtil.ok(
      { status: 'ok' },
      'BSC Organics API is healthy - GET',
    ); // returns a standardized response indicating the service is healthy. here ResponseUtil.ok is a utility method that formats the response in a consistent way, indicating success with a status code of 200 and including a message along with the data payload.
  }

  @Post('health-check')
  checkPost(): ApiResponse<{ status: string }> {
    return ResponseUtil.ok(
      { status: 'ok' },
      'BSC Organics API is healthy - POST',
    );
  }

  @Get()
  getInfo(): ApiResponse<{
    name: string;
    version: string;
    description: string;
  }> {
    return ResponseUtil.ok(
      {
        name: 'BSC Organics API',
        version: '1.0.0',
        description: 'E-commerce backend for spices and organic products',
      },
      'API information retrieved successfully',
    );
  }
}
