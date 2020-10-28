import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';

@Entity({ name: 'Products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column('decimal', { nullable: false, default: 1.0 })
  coefficient: number;

  @Column({ nullable: false, default: true })
  advisable: boolean;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @Column('simple-array', { nullable: true })
  picturesNames: string[];

  costOfServing: number;

  @AfterLoad()
  countCostOfServing() {
    this.costOfServing = Math.round(this.price * this.coefficient);
  }
}
