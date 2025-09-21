import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from '../../../shared/models/base.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ name: 'fullname', type: 'varchar', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'last_logged_at', type: 'timestamp', nullable: true })
  lastLoggedAt: Date | null;
}
