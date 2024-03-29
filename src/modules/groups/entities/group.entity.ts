import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @ManyToOne(() => User, (user) => user.groups, { nullable: true })
  user: User;

  @Column()
  userId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
