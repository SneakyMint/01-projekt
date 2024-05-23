import React, { FC, useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  ToastContainer,
  Toast,
} from 'react-bootstrap'
import DashboardLayout from 'components/ui/DashboardLayout_UI'
import * as API from 'api/Api'
import { BidType, BidTypeWhole } from 'models/bid_model'
import authStore from 'stores/auth.store'
import { AuctionType, AuctionTypeWhole } from 'models/auction_model'
import {UserType} from 'models/auth_model'
const DashboardBids: FC = () => {
  const userId = authStore.getUserId()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const { data, isLoading, refetch } = useQuery(
    ['getBidsByBidderId', authStore.getUserId()],
    () => API.getBidsByBidderId(authStore.getUserId()),
  )

  const placeBidMutation = useMutation(
    ({ id, bid }: { id: string; bid: number }) =>
      API.placeBid(id, authStore.getUserId(), bid),
    {
      onError: (error: any) => {
        setApiError(error.message || 'Failed to place bid')
        setShowError(true)
      },
      onSuccess: () => {
        refetch()
      },
    },
  )

  const handlePlaceBid = (
    id: string,
    bid: number,
    startPrice: number,
    highestBidAmount: number,
  ) => {
    if (bid <= startPrice) {
      setApiError('Your bid must be higher than the starting price.')
      setShowError(true)
      return
    }

    if (bid <= highestBidAmount) {
      setApiError('Your bid must be higher than the current highest bid.')
      setShowError(true)
      return
    }

    placeBidMutation.mutate({ id, bid })
  }

  const getHighestBid = (bids: BidTypeWhole[]) => {
    if (!bids.length) return { id: '', bid_amount: 0, auction_item: {} as AuctionTypeWhole, bidder: {} as UserType, created_at: '', updated_at: '', status: '' }
    const highestBid = bids.reduce(
      (max, bid) => (bid.bid_amount > max.bid_amount ? bid : max),
      bids[0],
    )
    return highestBid
  }

  const isAuctionEnded = (endDate: string) => {
    return new Date().getTime() > new Date(endDate).getTime()
  }

  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const timeLeft = end - now
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    return hoursLeft > 0 ? `${hoursLeft} hours` : 'Expired'
  }

  const isWinningBid = (bid: BidTypeWhole, highestBid: BidTypeWhole) => {
    return bid.id === highestBid.id
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowError(false)}
          show={showError}
          delay={3000}
          autohide
          bg="danger"
        >
          <Toast.Body>{apiError}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1>Your Bids</h1>
          </Col>
        </Row>
        {isLoading ? (
          <div>Loading...</div>
        ) : data?.data.length ? (
          <Row>
            {data.data.map((bid: BidTypeWhole) => {
              const auction = bid.auction_item
              const highestBid = getHighestBid(auction.bids)
              const auctionEnded = isAuctionEnded(auction.end_date)
              const winningBid = isWinningBid(bid, highestBid)
              const cardClass = auctionEnded && winningBid ? 'border-success' : ''
              const timeLeft = calculateTimeLeft(auction.end_date)
              const isExpired = timeLeft === 'Expired'
              return (
                <Col key={auction.id} xs={12} md={6} lg={4} className="mb-4">
                  <Card className={cardClass}>
                    <Card.Img
                      variant="top"
                      src={`${process.env.REACT_APP_API_URL}/files/${auction.image}`}
                    />
                    <Card.Body>
                      <Card.Title>{auction.title}</Card.Title>
                      <Card.Text>{auction.description}</Card.Text>
                      <Card.Text>
                        Starting Bid: ${auction.start_price}
                      </Card.Text>
                      <Card.Text>
                        Highest Bid: $
                        {highestBid.bid_amount > 0
                          ? highestBid.bid_amount
                          : 'No bids yet'}
                      </Card.Text>
                      <Card.Text>
                        End Date:{' '}
                        {new Date(auction.end_date).toLocaleDateString()}
                      </Card.Text>
                      {isExpired && winningBid && (
                        <div className="text-center">
                          <span className="badge bg-success">BOUGHT</span>
                        </div>
                      )}
                      {!isExpired ? (
                        <Button
                          variant="primary"
                          onClick={() => {
                            const bidAmount = Number(
                              prompt('Enter your bid amount:'),
                            )
                            if (!isNaN(bidAmount)) {
                              handlePlaceBid(
                                auction.id,
                                bidAmount,
                                auction.start_price,
                                highestBid.bid_amount,
                              )
                            } else {
                              setApiError('Invalid bid amount.')
                              setShowError(true)
                            }
                          }}
                        >
                          Your Bid: ${bid.bid_amount + ' '}
                          Status: {bid.status}
                        </Button>
                      ) : (
                        <Button variant="secondary" disabled>
                          Auction Ended
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        ) : (
          <div>No bids found</div>
        )}
      </Container>
    </DashboardLayout>
  )
}

export default DashboardBids
