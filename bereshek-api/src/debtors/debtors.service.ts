import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debtor } from './entities/debtor.entity';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { FilterDebtorDto } from './dto/filter-debtor.dto';
import { DebtStatus } from '../debts/entities/debt.entity';

@Injectable()
export class DebtorsService {
  constructor(
    @InjectRepository(Debtor)
    private debtorsRepository: Repository<Debtor>,
  ) {}

  async create(createDebtorDto: CreateDebtorDto, userId: string): Promise<Debtor> {
    const debtor = this.debtorsRepository.create({
      ...createDebtorDto,
      user: { id: userId },
    });
    return await this.debtorsRepository.save(debtor);
  }

  async findAll(userId: string, filterDto?: FilterDebtorDto): Promise<Debtor[]> {
    const query = this.debtorsRepository.createQueryBuilder('debtor')
      .leftJoinAndSelect('debtor.debts', 'debt')
      .where('debtor.user.id = :userId', { userId });

    if (filterDto) {
      this.applyFilters(query, filterDto);
    }

    if (filterDto?.sortBy) {
      const order = filterDto.sortOrder || 'ASC';
      query.orderBy(`debtor.${filterDto.sortBy}`, order);
    } else {
      query.orderBy('debtor.createdAt', 'DESC');
    }

    return await query.getMany();
  }

  private applyFilters(query: any, filterDto: FilterDebtorDto) {
    const { search, isProblematic, hasActiveDebts, hasOverdueDebts } = filterDto;

    if (search) {
      query.andWhere(
        '(debtor.firstName ILIKE :search OR debtor.lastName ILIKE :search OR debtor.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isProblematic !== undefined) {
      query.andWhere('debtor.isProblematic = :isProblematic', { isProblematic });
    }

    if (hasActiveDebts) {
      query.andWhere('EXISTS (SELECT 1 FROM debt WHERE debt.debtor = debtor.id AND debt.status = :activeStatus)', 
        { activeStatus: DebtStatus.ACTIVE }
      );
    }

    if (hasOverdueDebts) {
      query.andWhere('EXISTS (SELECT 1 FROM debt WHERE debt.debtor = debtor.id AND debt.status = :overdueStatus)',
        { overdueStatus: DebtStatus.OVERDUE }
      );
    }
  }

  async findOne(id: string, userId: string): Promise<Debtor> {
    const debtor = await this.debtorsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['debts'],
    });

    if (!debtor) {
      throw new NotFoundException('Debtor not found');
    }

    return debtor;
  }

  async update(id: string, updateData: Partial<Debtor>, userId: string): Promise<Debtor> {
    const debtor = await this.findOne(id, userId);
    Object.assign(debtor, updateData);
    return await this.debtorsRepository.save(debtor);
  }

  async remove(id: string, userId: string): Promise<void> {
    const debtor = await this.findOne(id, userId);
    await this.debtorsRepository.remove(debtor);
  }
} 