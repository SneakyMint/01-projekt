import { Expose } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger';

export class Base {
  @ApiProperty({
    description: 'The unique identifier of the entity',
    example: '5ga98g23456c6gd4g454g33sgs4',
  })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Expose()
  id: string

  @ApiProperty({
    description: 'The creation date of the entity',
    example: '2024-03-01T00:12:33.000Z',
  })
  @CreateDateColumn()
  @Expose()
  created_at: Date
  
  @ApiProperty({
    description: 'The update date of the entity',
    example: '2022-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  @Expose()
  updated_at: Date
}
