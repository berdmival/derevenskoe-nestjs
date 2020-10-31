import { BaseEntity, DeepPartial, Repository } from 'typeorm';

export abstract class CommonService<T extends BaseEntity> {
  constructor(private repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T> {
    return this.repository.findOneOrFail(id);
  }

  async create(item: DeepPartial<T>) {
    return this.repository.save(item);
  }

  async update(id: number, item: DeepPartial<T>) {
    const oldItem = await this.repository.findOneOrFail(id);
    return this.repository.save({ ...oldItem, ...item });
  }

  async remove(id: number) {
    const item = await this.repository.findOneOrFail(id);
    return this.repository.remove(item);
  }
}
