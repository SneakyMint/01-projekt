import React, { FC, useState } from 'react'
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
import { useQuery, useMutation } from 'react-query'
import * as API from 'api/Api'
import { AuctionType } from 'models/auction_model'
import { BidType } from 'models/bid_model'
import authStore from 'stores/auth.store'
import { routes } from 'constants/routesConstants'
import { Link } from 'react-router-dom'

const DashboardAuctions: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'highestBid'>('date')

  const userId = authStore.getUserId()

  const { data, isLoading, refetch } = useQuery(
    ['fetchAuctionsByUserId', userId],
    () => API.fetchAuctionsByUserId(userId),
    {
      onError: (error: any) => {
        setApiError(error.message || 'Failed to fetch auctions')
        setShowError(true)
      },
    },
  )

  const deleteAuctionMutation = useMutation(
    (id: string) => API.deleteAuction(id),
    {
      onError: (error: any) => {
        setApiError(error.message || 'Failed to delete auction')
        setShowError(true)
      },
      onSuccess: () => {
        refetch()
      },
    },
  )

  const handleDeleteAuction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      deleteAuctionMutation.mutate(id)
    }
  }

  const getHighestBid = (bids: BidType[]) => {
    if (!bids.length) return { bid_amount: 0 }
    const highestBid = bids.reduce(
      (max, bid) => (bid.bid_amount > max.bid_amount ? bid : max),
      bids[0],
    )
    return highestBid
  }

  const sortAuctions = (auctions: AuctionType[]) => {
    if (sortBy === 'date') {
      return auctions.sort(
        (a, b) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
      )
    } else {
      return auctions.sort((a, b) => {
        const highestBidA = getHighestBid(a.bids).bid_amount
        const highestBidB = getHighestBid(b.bids).bid_amount
        return highestBidB - highestBidA
      })
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Auctions</h1>
        <div>
          <Button
            variant="primary"
            onClick={() => setSortBy('date')}
            className={sortBy === 'date' ? 'active' : ''}
          >
            Sort by Date
          </Button>
          <Button
            variant="primary"
            onClick={() => setSortBy('highestBid')}
            className={sortBy === 'highestBid' ? 'active' : ''}
          >
            Sort by Highest Bid
          </Button>
          <Button
            variant="primary"
            href={routes.DASHBOARD_PREFIX + '/auctions/add'}
          >
            Create Auction
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : data?.data?.length ? (
        <Container>
          <Row>
            {sortAuctions(data.data).map((auction: AuctionType) => {
              const highestBid = getHighestBid(auction.bids)
              return (
                <Col key={auction.id} xs={12} md={6} lg={4} className="mb-4">
                  <Card>
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
                      
                      
                      
                    </Card.Body>
                    <Card.Footer>
                    <Link
                        to={`${routes.DASHBOARD_PREFIX}/auctions/edit`}
                        state={{
                          ...auction,
                        }}
                      >
                        <Button variant="primary">
                        Edit
                        </Button>
                      </Link>
                      
                        <Button
                          variant="danger"
                          className="mt-2"
                          onClick={() => handleDeleteAuction(auction.id)}
                        >
                          Delete
                        </Button>
                      </Card.Footer>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Container>
      ) : (
        <div>No auctions found</div>
      )}
    </DashboardLayout>
  )
}

export default DashboardAuctions
