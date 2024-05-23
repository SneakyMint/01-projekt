import { AuctionType, AuctionTypeWhole } from './auction_model'
import { UserType } from './auth_model'

export type BidType = {
  auction_item_id: string
  bid_amount: number
  bidder: UserType
  created_at: string
  id: string
  updated_at: string
  status: string
}
export type BidTypeWhole = {
  auction_item: AuctionTypeWhole
  bid_amount: number
  bidder: UserType
  created_at: string
  id: string
  updated_at: string
  status: string
}
