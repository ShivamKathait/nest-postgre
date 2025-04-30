import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Admin } from './admin.entity';
  import { Role } from 'src/common/utils';
  
  @Entity({ name: 'sessions' })
  export class Session {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Admin, admin => admin.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'admin_id' })
    admin: Admin;
  
    @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
    role: Role;
  
    @Column({ type: 'bigint', default: () => `EXTRACT(EPOCH FROM NOW()) * 1000` })
    created_at: number;
  }
  