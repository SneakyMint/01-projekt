import React, { FC, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { Container, Card, Button, ToastContainer, Toast, Row, Col } from 'react-bootstrap'
import * as API from 'api/Api'
import { AuctionType } from 'models/auction_model'
import { BidType } from 'models/bid_model'
import authStore from 'stores/auth.store'
import DashboardLayout from 'components/ui/DashboardLayout_UI'
import 'styles/DashboardAuctionsView.css' // Import CSS for additional styling

const DashboardAuctionsView: FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [curretAuction, setCurrentAuction] = useState<AuctionType>()
  useEffect(() => {
    if (location.state) {
      setCurrentAuction(location.state as AuctionType)
    }
  }, [location.state])

  const { data, isLoading, refetch } = useQuery(
    ['fetchAuctionById', id],
    () => API.fetchAuctionById(id || ''),
    {
      enabled: !!id,
      onError: (error: any) => {
        setApiError(error.message || 'Failed to fetch auction')
        setShowError(true)
      },
    },
  )

  useEffect(() => {
    if (data) {
      const endDate = new Date(data.end_date).getTime()
      const now = new Date().getTime()
    }
  }, [data])

  const placeBidMutation = useMutation(
    ({ bid }: { bid: number }) =>
      API.placeBid(id || '', authStore.getUserId(), bid),
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

    placeBidMutation.mutate({ bid })
  }

  const getHighestBid = (bids: BidType[]) => {
    if (!bids.length) return { bid_amount: 0 }
    return bids.reduce(
      (max, bid) => (bid.bid_amount > max.bid_amount ? bid : max),
      bids[0],
    )
  }

  if (isLoading) return <div>Loading...</div>
  if (!curretAuction) return <div>No auction found</div>

  const auction = curretAuction
  
  const highestBid = getHighestBid(auction.bids)

  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    const timeLeft = end - now
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    
    return hoursLeft > 0 ? `${hoursLeft} hours` : 'Expired'
  }
  const timeLeft = calculateTimeLeft(auction.end_date)
  const isExpired = timeLeft === 'Expired'
  return (
    <DashboardLayout>
      <Container>
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
        <Card className="auction-card">
          <Row noGutters>
            <Col md={6}>
              <Card.Img
                variant="top"
                src={`${process.env.REACT_APP_API_URL}/files/${auction.image}`}
                className="auction-image"
              />
            </Col>
            <Col md={6}>
              <Card.Body>
                <Card.Title className="auction-title">{auction.title}</Card.Title>
                <Card.Text>{auction.description}</Card.Text>
                <Card.Text>Starting Bid: ${auction.start_price}</Card.Text>
                <Card.Text>
                  Highest Bid: $
                  {highestBid.bid_amount > 0 ? highestBid.bid_amount : 'No bids yet'}
                </Card.Text>
                <Card.Text>
                  End Date: {new Date(auction.end_date).toLocaleDateString()}
                </Card.Text>
                <Card.Text>Ends in: {calculateTimeLeft(auction.end_date) }</Card.Text>
                {!isExpired ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const bidAmount = Number(prompt('Enter your bid amount:'))
                      if (!isNaN(bidAmount)) {
                        handlePlaceBid(
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
                    Place Bid
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    Auction Ended
                  </Button>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </DashboardLayout>
  )
}

export default DashboardAuctionsView
