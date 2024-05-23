import { Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AuctionItem } from './auction_item.entity';
import { Bid } from './bid.entity';

import { Base } from './base.entity'
import { Role } from './role.entity'

@Entity()
export class User extends Base {
  @ApiProperty({
    description: 'The email of the user',
    example: 'mihael.pusnik@example.com',
  })
  @Column({ unique: true })
  @Column({ unique: true })
  email: string


  @ApiProperty({
    description: 'The first name of the user',
    example: 'Mihael',
    nullable: true,
  })
  @Column({ nullable: true })
  first_name: string

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Pusnik',
    nullable: true,
  })
  @Column({ nullable: true })
  last_name: string

  @ApiProperty({
    description: 'The avatar of the user',
    example: 'avatar.jpg',
    nullable: true,
  })
  @Column({ nullable: true })
  avatar: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    nullable: true,
  })
  @Column({ nullable: true })
  @Exclude()
  password: string

  @ManyToOne(() => Role, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role | null

  @ApiProperty({
    type: () => [AuctionItem],
    description: 'The auction items of the user',
  })
  @OneToMany(() => AuctionItem, (auction_item) => auction_item.user)
  auction_items: AuctionItem[];

  @ApiProperty({ type: () => [Bid], description: 'The bids of the user' })
  @OneToMany(() => Bid, (bid) => bid.bidder)
  bids: Bid[];
}
