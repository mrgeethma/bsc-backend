//if not have mentioned as nullable, it will be considered as not null by default. because in typeorm, by default, columns are not nullable unless explicitly specified.
//string,number,boolean,date are primitive types 
//int, varchar, text, uuid, boolean, json,decimal are database column types
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true }) //this is the name of the product and it should be unique and not null. if null, it will throw an error because of the unique constraint.
  name: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // e.g., 9999.99
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice: number; // Original price if on sale.

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  images: string[]; // Array of image URLs

  @Column({ type: 'varchar', length: 50, nullable: true })
  sku: string; // Stock Keeping Unit

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight: number; // In kilograms

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string; // e.g., 'kg', 'g', 'piece', 'pack'

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: true })
  inStock: boolean;

  @Column({ type: 'boolean', default: false }) 
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'json', nullable: true })
  tags: string[]; // Array of tags for better searchability. differece array and object is that object is key value pair while array is just a list of values.

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  review: number; // Average review rating (e.g., 4.1, 4.7)

  @Column({ type: 'int', default: 0 })
  reviewCount: number; // Number of reviews

  // Relationship with Category
  @Column({ type: 'uuid' })
  categoryId: string; // Foreign key to Category entity

  @ManyToOne(() => Category) // many products can belong to one category
  @JoinColumn({ name: 'categoryId' }) // specifies the foreign key column
  category: Category; // category entity relation which allows access to category details

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

