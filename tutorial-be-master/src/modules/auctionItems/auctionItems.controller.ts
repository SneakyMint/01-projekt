import {Controller,UseInterceptors,ClassSerializerInterceptor,Get,HttpCode,HttpStatus,Query,Param,Post,Body,UploadedFile,Patch,Delete,Req,UseGuards} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

import { parse } from 'cookie';
import { saveImageToStorage } from 'helpers/imageStorage';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { AuctionItemsService } from './auctionItems.service';
import { AuctionItem } from 'entities/auction_item.entity';
import { CreateUpdateAuctionItemDto } from './dto/createUpdateAuctionItem.dto';
import { Request } from 'express';
import Logging from 'library/Logging';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Auction Items')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication',
  required: true,
})
@Controller('auctions')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionItemsController {
  constructor(private readonly auctionItemsService: AuctionItemsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve a paginated list of auction items' })
  @ApiQuery({ name: 'page', description: 'The page number for pagination' })
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    Logging.info('Fetching all auction items');
    return this.auctionItemsService.paginate(page);
  }

  @Get('/all')
@HttpCode(HttpStatus.OK)
@ApiOperation({ description: 'Retrieve auctions' })
async findAllAuction(): Promise<AuctionItem[]> {
  return this.auctionItemsService.fetchAllAuctions();
}


  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve auction items by a specific user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findByUser(@Param('userId') userId: string): Promise<AuctionItem[]> {
    //Logging.info('Fetching all auction items from a specific user'+ userId);

    return this.auctionItemsService.fetchByUser(userId);
  }

  

  @Get('bidded/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items bidded on by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findBidded(@Param('userId') userId: string): Promise<AuctionItem[]> {
    Logging.info('Fetching all auction items bidded on by a specific user'+ userId);
    return this.auctionItemsService.findBidded(userId);
  }

  @Get('/won/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items won by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findWon(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWon(userId);
  }

  @Get('/winning/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve auction items currently winning by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  async findWinning(@Param('userId') userId: string): Promise<AuctionItem[]> {
    return this.auctionItemsService.findWinning(userId);
  }

  @Get('auction/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Retrieve an auction item with specific ID',
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item' })
  async findOne(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.findAuctionByAuctionId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
    @Req() req: Request,
  ): Promise<AuctionItem> {
    const cookies = parse(req.headers.cookie || ''); // Parse the cookies from the request headers
    const user_id = cookies['user_id']; // Access the user_id from the parsed cookies
    const userId = user_id;
    Logging.info('user ID: ' + userId);
    return this.auctionItemsService.create(createUpdateAuctionItemDto, userId);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AuctionItem> {
    console.log('Content-Type:', req.headers['content-type']);
    console.log('file', file);
    return await this.auctionItemsService.handleFileUpload(file, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateUpdateAuctionItemDto,
    description: 'The updated auction item details',
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item to update' })
  @ApiResponse({
    status: 200,
    description: 'The auction item has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update an existing auction item',
  })
  async update(
    @Param('id') id: string,
    @Body() createUpdateAuctionItemDto: CreateUpdateAuctionItemDto,
  ): Promise<AuctionItem> {
    return this.auctionItemsService.update(id, createUpdateAuctionItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'The ID of the auction item to delete' })
  @ApiResponse({
    status: 200,
    description: 'The auction item has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Delete an existing auction item',
  })
  async remove(@Param('id') id: string): Promise<AuctionItem> {
    return this.auctionItemsService.remove(id);
  }
}
