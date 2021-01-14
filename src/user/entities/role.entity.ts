import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';

@Entity({name: 'Roles'})
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @ManyToMany(() => UserEntity)
    users: UserEntity[];
}
