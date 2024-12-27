import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Debt } from './entities/debt.entity';

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @Request() req): Promise<Debt> {
    return this.debtsService.create(createDebtDto, req.user.id);
  }

  @Get()
  findAll(@Request() req): Promise<Debt[]> {
    return this.debtsService.findAll(req.user.id);
  }

  @Get('overdue')
  findOverdue(@Request() req): Promise<Debt[]> {
    return this.debtsService.findOverdue(req.user.id);
  }

  @Get('upcoming')
  findUpcoming(@Request() req, @Query('days') days: number): Promise<Debt[]> {
    return this.debtsService.findUpcoming(req.user.id, days);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Debt> {
    return this.debtsService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Debt>,
    @Request() req,
  ): Promise<Debt> {
    return this.debtsService.update(id, updateData, req.user.id);
  }

  @Put(':id/pay')
  markAsPaid(@Param('id') id: string, @Request() req): Promise<Debt> {
    return this.debtsService.markAsPaid(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.debtsService.remove(id, req.user.id);
  }
} 