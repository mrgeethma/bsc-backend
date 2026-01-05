import { Controller, Get, Post } from '@nestjs/common';
import type { ApiResponse } from './common/utils/response.util';
import { ResponseUtil } from './common/utils/response.util';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor() {}

  @Get('health-check')
  @ApiOperation({ summary: 'Get health status' })
  @SwaggerApiResponse({ status: 200, description: 'Service is healthy' })
  check(): ApiResponse<{ status: string }> {
    return ResponseUtil.ok({ status: 'ok' }, 'BSC Organics API is healthy - GET');
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