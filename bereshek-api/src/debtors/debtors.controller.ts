import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { DebtorsService } from './debtors.service';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Debtor } from './entities/debtor.entity';

@Controller('debtors')
@UseGuards(JwtAuthGuard)
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Post()
  create(@Body() createDebtorDto: CreateDebtorDto, @Request() req): Promise<Debtor> {
    return this.debtorsService.create(createDebtorDto, req.user);
  }

  @Get()
  findAll(@Request() req): Promise<Debtor[]> {
    return this.debtorsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Debtor> {
    return this.debtorsService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebtorDto: Partial<CreateDebtorDto>,
    @Request() req,
  ): Promise<Debtor> {
    return this.debtorsService.update(id, updateDebtorDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.debtorsService.remove(id, req.user.id);
  }
} 