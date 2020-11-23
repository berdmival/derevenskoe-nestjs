import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'Users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, default: `user${Date.now()}` })
  name: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  secondName: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  pictureName: string;

  @Column({ nullable: false, default: true })
  enabled: boolean;

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[];
}
