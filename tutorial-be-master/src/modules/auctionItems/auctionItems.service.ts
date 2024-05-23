import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';
import Logging from 'library/Logging';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';
import { AuctionItem } from 'entities/auction_item.entity';
import { User } from 'entities/user.entity';
import { join } from 'path';
import { isFileExtensionSafe, removeFile } from 'helpers/imageStorage';
import * as cron from 'node-cron';

@Injectable()
export class AuctionItemsService extends AbstractService {
  constructor(
    @InjectRepository(AuctionItem)
    private readonly auctionItemsRepository: Repository<AuctionItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Check auction status every hour
    cron.schedule('0 * * * *', async () => {
      const auctionItems = await this.findAll();
      auctionItems.forEach(async (item) => {
        await this.checkAuctionStatus(item);
      });
    });
    super(auctionItemsRepository);
  }

  async findAuctionByAuctionId(id: string): Promise<AuctionItem> {
    try {
      return this.auctionItemsRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while searching for the auction item.',
      );
    }
  }

  async findWon(userId: string): Promise<AuctionItem[]> {
    const status = 'Winning';
    const now = new Date().toISOString();
    try {
      const winnings = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .where('bids.user_id = :userId', { userId })
        .andWhere('bids.status = :status', { status: status })
        .andWhere('auction_item.end_date < :now', { now: now })
        .getMany();

      return winnings;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated elements.',
      );
    }
  }

  async findWinning(userId: string): Promise<AuctionItem[]> {

    const status = 'Winning';
    const now = new Date().toISOString();
    try {
      const winnings = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .where('bids.user_id = :userId', { userId })
        .andWhere('bids.status = :status', { status: status })
        .andWhere('auction_item.end_date > :now', { now: now })
        .getMany();

      return winnings;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated elements.',
      );
    }
  }

  async create(
    createAuctionItemDto: CreateUpdateAuctionItemDto,
    userId: string,
  ): Promise<AuctionItem> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const auctionItem = this.auctionItemsRepository.create({
        ...createAuctionItemDto,
        user: user,
      });

      return this.auctionItemsRepository.save(auctionItem);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new auction item.',
      );
    }
  }

  async handleFileUpload(file, auction_item_id) {
    const filename = file?.filename;

    if (!filename) {
      throw new BadRequestException('File must be a png, jpg/jpeg');
    }

    // create a path to the file inside the container
    const imagesFolderPath = join(process.cwd(), 'files');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    Logging.info(`Full image path: ${fullImagePath}`);
    // check if the file extension is safe
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.updateAuctionItemImage(auction_item_id, filename);
    }

    // remove the file if the extension is not safe
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }

  async update(
    auctionItemId: string,
    createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    const auctionItem = (await this.findById(auctionItemId)) as AuctionItem;

    try {
      auctionItem.title = createUpdateAuctionItemDto.title;
      auctionItem.description = createUpdateAuctionItemDto.description;
      auctionItem.image = createUpdateAuctionItemDto.image;
      auctionItem.start_price = createUpdateAuctionItemDto.start_price;
      auctionItem.end_date = createUpdateAuctionItemDto.end_date;

      return this.auctionItemsRepository.save(auctionItem);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating the auction item.',
      );
    }
  }

  async updateAuctionItemImage(
    id: string,
    image: string,
  ): Promise<AuctionItem> {
    const auctionItem = await this.findById(id);

    return this.update(auctionItem.id, { ...auctionItem, image });
  }

  async fetchByUser(userId: string): Promise<AuctionItem[]> {
    Logging.info(`Fetching auctions by user+ ${userId}`);
    try {
      const auctions = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .where('auction_item.user_id = :userId', { userId })
        .orderBy('auction_item.end_date', 'ASC') // or 'DESC' for descending order
        .getMany();
      
        //Logging.info(`Fetched auctions: ${JSON.stringify(auctions, null, 2)}`);
      //console.log(`Fetching auctions now`, auctions);
      return auctions;
      

    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for elements.',
      );
    }
  }
  async fetchAllAuctions(): Promise<AuctionItem[]> {
    Logging.info(`Fetching auctions`);
    try {
      const auctions = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .orderBy('auction_item.end_date', 'ASC') // or 'DESC' for descending order
        .getMany();
      
        //Logging.info(`Fetched auctions: ${JSON.stringify(auctions, null, 2)}`);
      //console.log(`Fetching auctions now`, auctions);
      return auctions;
      

    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for elements.',
      );
    }
  }

  async findBidded(userId: string): Promise<AuctionItem[]> {
    try {
      const bidded = await this.auctionItemsRepository
        .createQueryBuilder()
        .select('auction_item')
        .from(AuctionItem, 'auction_item')
        .leftJoinAndSelect('auction_item.bids', 'bids')
        .where('bids.user_id = :userId', { userId })
        .getMany();

      return bidded;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for elements.',
      );
    }
  }

  async checkAuctionStatus(auctionItem: AuctionItem) {
    // calculate time left
    const timeLeft =
      new Date(auctionItem.end_date).getTime() - new Date().getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);

  }
}
