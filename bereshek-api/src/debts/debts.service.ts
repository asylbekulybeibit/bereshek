import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between, ILike } from 'typeorm';
import { Debt, DebtStatus } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { FilterDebtDto } from './dto/filter-debt.dto';
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

  async findAll(userId: string, filterDto?: FilterDebtDto): Promise<Debt[]> {
    const query = this.debtsRepository.createQueryBuilder('debt')
      .leftJoinAndSelect('debt.debtor', 'debtor')
      .where('debtor.user.id = :userId', { userId });

    if (filterDto) {
      this.applyFilters(query, filterDto);
    }

    query.orderBy('debt.dueDate', 'ASC');

    return await query.getMany();
  }

  private applyFilters(query: any, filterDto: FilterDebtDto) {
    const {
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      debtorId,
      search,
    } = filterDto;

    if (status) {
      query.andWhere('debt.status = :status', { status });
    }

    if (startDate && endDate) {
      query.andWhere('debt.dueDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (minAmount) {
      query.andWhere('debt.amount >= :minAmount', { minAmount });
    }

    if (maxAmount) {
      query.andWhere('debt.amount <= :maxAmount', { maxAmount });
    }

    if (debtorId) {
      query.andWhere('debtor.id = :debtorId', { debtorId });
    }

    if (search) {
      query.andWhere(
        '(debtor.firstName ILIKE :search OR debtor.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }
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

  async getStatistics(userId: string) {
    const totalDebts = await this.debtsRepository.count({
      where: { debtor: { user: { id: userId } } },
    });

    const activeDebts = await this.debtsRepository.count({
      where: {
        debtor: { user: { id: userId } },
        status: DebtStatus.ACTIVE,
      },
    });

    const overdueDebts = await this.debtsRepository.count({
      where: {
        debtor: { user: { id: userId } },
        status: DebtStatus.OVERDUE,
      },
    });

    const totalAmount = await this.debtsRepository
      .createQueryBuilder('debt')
      .leftJoin('debt.debtor', 'debtor')
      .where('debtor.user.id = :userId', { userId })
      .select('SUM(debt.amount)', 'total')
      .getRawOne();

    const activeAmount = await this.debtsRepository
      .createQueryBuilder('debt')
      .leftJoin('debt.debtor', 'debtor')
      .where('debtor.user.id = :userId', { userId })
      .andWhere('debt.status = :status', { status: DebtStatus.ACTIVE })
      .select('SUM(debt.amount)', 'total')
      .getRawOne();

    return {
      totalDebts,
      activeDebts,
      overdueDebts,
      totalAmount: totalAmount?.total || 0,
      activeAmount: activeAmount?.total || 0,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const debt = await this.findOne(id, userId);
    await this.debtsRepository.remove(debt);
  }
} 