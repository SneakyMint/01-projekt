import { UserType } from './auth_model'
import { BidTypeWhole, BidType } from './bid_model'

export type AuctionType = {
  bids: BidType[]
  user: UserType
  id: string
  title: string
  description: string
  start_price: number
  end_date: string
  image: string
  user_id: string
}
export type AuctionTypeWhole = {
  bids: BidTypeWhole[]
  user: UserType
  id: string
  title: string
  description: string
  start_price: number
  end_date: string
  image: string
  user_id: string
}
