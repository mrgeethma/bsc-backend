import { Controller, Get, Post } from '@nestjs/common'; // importing necessary decorators and modules from NestJS common package
import type { ApiResponse } from './common/utils/response.util'; // importing the ApiResponse type from a utility file to standardize API responses. it helps ensure consistent response structures across the application.
import { ResponseUtil } from './common/utils/response.util'; // importing a utility class for creating standardized API responses and it provides methods to generate success and error responses and maintain consistency in how responses are formatted.
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger'; // importing decorators from the NestJS Swagger module to document the API endpoints. these decorators help generate interactive API documentation that can be viewed in a web interface.

@Controller() // base route for this controller is '/'.
@ApiTags('Health Check') // what this does: it groups the endpoints in Swagger UI under "Health Check". swagger  is a tool for documenting APIs and this tag helps organize the endpoints. we can use swagger-ui to visualize and interact with the API's resources without having any of the implementation logic in place. it is an alternative to postman for testing APIs. difference between swagger and postman is that swagger provides a user interface to visualize and interact with the API's resources, while postman is more focused on testing and debugging APIs.
export class AppController { 
  constructor() {} // No dependencies to inject here because this controller is simple. But we keep the constructor for consistency

  @Get('health-check')
  @ApiOperation({ summary: 'Get health status' }) // brief description of what this endpoint does and it appears in the swagger documentation
  @SwaggerApiResponse({ status: 200, description: 'Service is healthy' }) // describes the expected response for this endpoint in the swagger documentation. 
  check(): ApiResponse<{ status: string }> { // method to handle GET requests to /health-check. here ApiResponse<{ status: string }> indicates that the method returns a standardized API response containing an object with a status property of type string. this helps ensure consistency in how responses are structured across the API. Here we are defining the structure of the response data.
    return ResponseUtil.ok({ status: 'ok' }, 'BSC Organics API is healthy - GET'); // returns a standardized response indicating the service is healthy. here ResponseUtil.ok is a utility method that formats the response in a consistent way, indicating success with a status code of 200 and including a message along with the data payload.
  }
  
  @Post('health-check')
  @ApiOperation({ summary: 'Post health status' })
  @SwaggerApiResponse({ status: 200, description: 'Service is healthy' })
  checkPost(): ApiResponse<{ status: string }> {
    return ResponseUtil.ok({ status: 'ok' }, 'BSC Organics API is healthy - POST');
  }

  @Get()
  @ApiOperation({ summary: 'Get API info' })
  @SwaggerApiResponse({ status: 200, description: 'API information' })
  getInfo(): ApiResponse<{ name: string; version: string; description: string }> {
    return ResponseUtil.ok(
      {
        name: 'BSC Organics API',
        version: '1.0.0',
        description: 'E-commerce backend for spices and organic products'
      },
      'API information retrieved successfully'
    );
  }
}