import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../shared/models/base.entity';

@Entity({ name: 'user_uploads' })
export class UserUpload extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  folder: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'file_size', type: 'int' })
  fileSize: number;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
