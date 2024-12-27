import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT токен доступа' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID пользователя' },
            email: { type: 'string', description: 'Email пользователя' },
            firstName: { type: 'string', description: 'Имя пользователя' },
            lastName: { type: 'string', description: 'Фамилия пользователя' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким email уже существует' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешный вход в систему',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', description: 'JWT токен доступа' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID пользователя' },
            email: { type: 'string', description: 'Email пользователя' },
            firstName: { type: 'string', description: 'Имя пользователя' },
            lastName: { type: 'string', description: 'Фамилия пользователя' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
} 