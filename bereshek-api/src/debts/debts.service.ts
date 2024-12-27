import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Debt, DebtStatus } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { DebtorsService } from '../debtors/debtors.service';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private debtsRepository: Repository<Debt>,
    private debtorsService: DebtorsService,
  ) {}

  async create(createDebtDto: CreateDebtDto, userId: string): Promise<Debt> {
    const debtor = await this.debtorsService.findOne(createDebtDto.debtorId, userId);
    
    const debt = this.debtsRepository.create({
      ...createDebtDto,
      debtor,
      status: DebtStatus.ACTIVE,
    });

    return await this.debtsRepository.save(debt);
  }

  async findAll(userId: string): Promise<Debt[]> {
    return await this.debtsRepository.find({
      where: { debtor: { user: { id: userId } } },
      relations: ['debtor'],
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Debt> {
    const debt = await this.debtsRepository.findOne({
      where: { id, debtor: { user: { id: userId } } },
      relations: ['debtor'],
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    return debt;
  }

  async update(id: string, updateData: Partial<Debt>, userId: string): Promise<Debt> {
    const debt = await this.findOne(id, userId);
    Object.assign(debt, updateData);
    return await this.debtsRepository.save(debt);
  }

  async markAsPaid(id: string, userId: string): Promise<Debt> {
    const debt = await this.findOne(id, userId);
    if (debt.status === DebtStatus.PAID) {
      throw new BadRequestException('Debt is already paid');
    }

    debt.status = DebtStatus.PAID;
    debt.paidDate = new Date();
    return await this.debtsRepository.save(debt);
  }

  async findOverdue(userId: string): Promise<Debt[]> {
    const today = new Date();
    return await this.debtsRepository.find({
      where: {
        debtor: { user: { id: userId } },
        dueDate: LessThan(today),
        status: DebtStatus.ACTIVE,
      },
      relations: ['debtor'],
      order: { dueDate: 'ASC' },
    });
  }

  async findUpcoming(userId: string, days: number = 7): Promise<Debt[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await this.debtsRepository.find({
      where: {
        debtor: { user: { id: userId } },
        dueDate: LessThan(futureDate),
        status: DebtStatus.ACTIVE,
      },
      relations: ['debtor'],
      order: { dueDate: 'ASC' },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const debt = await this.findOne(id, userId);
    await this.debtsRepository.remove(debt);
  }
} 