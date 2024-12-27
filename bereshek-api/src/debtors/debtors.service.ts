import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debtor } from './entities/debtor.entity';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DebtorsService {
  constructor(
    @InjectRepository(Debtor)
    private debtorsRepository: Repository<Debtor>,
  ) {}

  async create(createDebtorDto: CreateDebtorDto, user: User): Promise<Debtor> {
    const debtor = this.debtorsRepository.create({
      ...createDebtorDto,
      user,
    });
    return await this.debtorsRepository.save(debtor);
  }

  async findAll(userId: string): Promise<Debtor[]> {
    return await this.debtorsRepository.find({
      where: { user: { id: userId } },
      relations: ['debts'],
    });
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

  async findById(id: string): Promise<Debtor> {
    const debtor = await this.debtorsRepository.findOne({
      where: { id },
      relations: ['debts'],
    });

    if (!debtor) {
      throw new NotFoundException('Debtor not found');
    }

    return debtor;
  }

  async update(id: string, updateDebtorDto: Partial<CreateDebtorDto>, userId: string): Promise<Debtor> {
    const debtor = await this.findOne(id, userId);
    Object.assign(debtor, updateDebtorDto);
    return await this.debtorsRepository.save(debtor);
  }

  async remove(id: string, userId: string): Promise<void> {
    const debtor = await this.findOne(id, userId);
    await this.debtorsRepository.remove(debtor);
  }
} 