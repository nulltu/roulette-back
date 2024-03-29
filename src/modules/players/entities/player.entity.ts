import { Group } from '../../../modules/groups/entities/group.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'players' })
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  groupId: number;

  @ManyToOne(() => Group, (group) => group.players)
  group: Group;
}
