import { Module } from '@nestjs/common';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItemsController } from './auctionItems.controller';
import { AuctionItem } from 'entities/auction_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([AuctionItem, User])],
  controllers: [AuctionItemsController],
  providers: [AuctionItemsService],
  exports: [AuctionItemsService],
})
export class AuctionItemsModule {}
