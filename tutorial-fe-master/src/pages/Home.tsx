import React, { FC } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Layout from 'components/ui/Layout_UI'
import { routes } from 'constants/routesConstants'

const Home: FC = () => {
  return (
    <Layout>
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h1>Welcome to the Auction House</h1>
            <p>
              Browse, bid, and win your favorite items in our online auction
              house. Discover unique items and place your bids today!
            </p>
            <Button variant="primary" href={routes.DASHBOARD_PREFIX}>
              View Auctions
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="images/Easy_Bidding.png" />
              <Card.Body>
                <Card.Title>Easy Bidding</Card.Title>
                <Card.Text>
                  Place your bids easily and keep track of your auctions in real
                  time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="images/Secure_Transactions.png" />
              <Card.Body>
                <Card.Title>Secure Transactions</Card.Title>
                <Card.Text>
                  Our platform ensures secure transactions for both buyers and
                  sellers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src="images/Wide_Selection.png" />
              <Card.Body>
                <Card.Title>Wide Selection</Card.Title>
                <Card.Text>
                  Explore a wide variety of items from different categories and
                  find what you love.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default Home
