import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'products' })
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 255 })
    name: string;
  
    @Column('text', { nullable: true })
    description?: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
  
    @Column({ default: true })
    is_active: boolean;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  }
  