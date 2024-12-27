import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { FilterDebtorDto } from './dto/filter-debtor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Debtor } from './entities/debtor.entity';

@ApiTags('debtors')
@ApiBearerAuth()
@Controller('debtors')
@UseGuards(JwtAuthGuard)
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового должника' })
  @ApiResponse({ status: 201, description: 'Должник успешно создан', type: Debtor })
  create(@Body() createDebtorDto: CreateDebtorDto, @Request() req): Promise<Debtor> {
    return this.debtorsService.create(createDebtorDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список должников' })
  @ApiResponse({ status: 200, description: 'Список должников', type: [Debtor] })
  findAll(@Request() req, @Query() filterDto: FilterDebtorDto): Promise<Debtor[]> {
    return this.debtorsService.findAll(req.user.id, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить должника по ID' })
  @ApiResponse({ status: 200, description: 'Должник найден', type: Debtor })
  @ApiResponse({ status: 404, description: 'Должник не найден' })
  findOne(@Param('id') id: string, @Request() req): Promise<Debtor> {
    return this.debtorsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные должника' })
  @ApiResponse({ status: 200, description: 'Данные должника обновлены', type: Debtor })
  @ApiResponse({ status: 404, description: 'Должник не найден' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Debtor>,
    @Request() req,
  ): Promise<Debtor> {
    return this.debtorsService.update(id, updateData, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить должника' })
  @ApiResponse({ status: 200, description: 'Должник удален' })
  @ApiResponse({ status: 404, description: 'Должник не найден' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.debtorsService.remove(id, req.user.id);
  }
} 