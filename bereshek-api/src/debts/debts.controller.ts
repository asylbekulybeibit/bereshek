import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { FilterDebtDto } from './dto/filter-debt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Debt } from './entities/debt.entity';

@ApiTags('debts')
@ApiBearerAuth()
@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый долг' })
  @ApiResponse({ status: 201, description: 'Долг успешно создан', type: Debt })
  create(@Body() createDebtDto: CreateDebtDto, @Request() req): Promise<Debt> {
    return this.debtsService.create(createDebtDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список долгов с фильтрацией' })
  @ApiResponse({ status: 200, description: 'Список долгов', type: [Debt] })
  findAll(@Request() req, @Query() filterDto: FilterDebtDto): Promise<Debt[]> {
    return this.debtsService.findAll(req.user.id, filterDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Получить статистику по долгам' })
  @ApiResponse({ 
    status: 200, 
    description: 'Статистика по долгам',
    schema: {
      type: 'object',
      properties: {
        totalDebts: { type: 'number', description: 'Общее количество долгов' },
        activeDebts: { type: 'number', description: 'Количество активных долгов' },
        overdueDebts: { type: 'number', description: 'Количество просроченных долгов' },
        totalAmount: { type: 'number', description: 'Общая сумма долгов' },
        activeAmount: { type: 'number', description: 'Сумма активных долгов' },
      },
    },
  })
  getStatistics(@Request() req) {
    return this.debtsService.getStatistics(req.user.id);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Получить список просроченных долгов' })
  @ApiResponse({ status: 200, description: 'Список просроченных долгов', type: [Debt] })
  findOverdue(@Request() req): Promise<Debt[]> {
    return this.debtsService.findOverdue(req.user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Получить список предстоящих долгов' })
  @ApiResponse({ status: 200, description: 'Список предстоящих долгов', type: [Debt] })
  findUpcoming(@Request() req, @Query('days') days: number): Promise<Debt[]> {
    return this.debtsService.findUpcoming(req.user.id, days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить долг по ID' })
  @ApiResponse({ status: 200, description: 'Долг найден', type: Debt })
  @ApiResponse({ status: 404, description: 'Долг не найден' })
  findOne(@Param('id') id: string, @Request() req): Promise<Debt> {
    return this.debtsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные долга' })
  @ApiResponse({ status: 200, description: 'Данные долга обновлены', type: Debt })
  @ApiResponse({ status: 404, description: 'Долг не найден' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Debt>,
    @Request() req,
  ): Promise<Debt> {
    return this.debtsService.update(id, updateData, req.user.id);
  }

  @Put(':id/pay')
  @ApiOperation({ summary: 'Отметить долг как оплаченный' })
  @ApiResponse({ status: 200, description: 'Долг отмечен как оплаченный', type: Debt })
  @ApiResponse({ status: 404, description: 'Долг не найден' })
  @ApiResponse({ status: 400, description: 'Долг уже оплачен' })
  markAsPaid(@Param('id') id: string, @Request() req): Promise<Debt> {
    return this.debtsService.markAsPaid(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить долг' })
  @ApiResponse({ status: 200, description: 'Долг удален' })
  @ApiResponse({ status: 404, description: 'Долг не найден' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.debtsService.remove(id, req.user.id);
  }
} 