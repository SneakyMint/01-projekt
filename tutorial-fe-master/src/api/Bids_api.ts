import { apiRoutes } from '../constants/apiConstants'
import { BidType } from '../models/bid_model'
import { apiRequest } from './Api'

export const placeBid = async (
  auctionItemId: string,
  bidderId: string,
  bidAmount: number,
) =>
  apiRequest<{ bidderId: string; bidAmount: number }, void>(
    'post',
    `${apiRoutes.BIDS_PREFIX}/${auctionItemId}`,
    { bidderId, bidAmount },
  )

export const getBidsByAuctionItemId = async (auctionItemId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/${auctionItemId}`,
  )

export const getBidsByBidderId = async (bidderId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/bidder/${bidderId}`,
  )
