import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterLoad,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'Products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column('decimal', { nullable: false, default: 1.0 })
  coefficient: number;

  @Column({ nullable: false, default: true })
  advisable: boolean;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @Column('text', { nullable: true })
  picturesNames: string[];

  @ManyToOne(
    type => CategoryEntity,
    category => category.products,
  )
  category: CategoryEntity;

  costOfServing: number;

  @AfterLoad()
  countCostOfServing() {
    this.costOfServing = Math.round(this.price * this.coefficient);
  }
}
