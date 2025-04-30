import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Session } from "./session.entity"
import { Role } from 'src/common/utils';

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ type: Boolean, default: false })
  is_deleted: boolean;

  @Column({ type: Boolean, default: false })
  is_email_verified: boolean;

  @Column()
  password: string;

  @Column({ type: String, enum: Role, default: Role.ADMIN })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otp_expire_at: Date | null;

  @OneToMany(() => Session, session => session.admin.id)
  sessions: Session[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}
