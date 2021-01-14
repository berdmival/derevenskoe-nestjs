import {ProductEntity} from 'src/product/entities/product.entity';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'Categories'})
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @Column('text', {nullable: true})
    description: string;

    @Column({nullable: true})
    pictureName: string;

    @Column({nullable: false, default: true})
    enabled: boolean;

    @ManyToOne(
        type => CategoryEntity,
        category => category.childCategories,
    )
    parentCategory: CategoryEntity;

    @OneToMany(
        type => CategoryEntity,
        category => category.parentCategory,
    )
    childCategories: CategoryEntity[];

    @OneToMany(
        type => ProductEntity,
        product => product.category,
    )
    products: ProductEntity[];
}
