import React, { FC } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import DashboardLayout from 'components/ui/DashboardLayout_UI'
import CreateUpdateAuctionForm from 'components/auctions/CreateUpdateAuctionForm'

const DashboardAuctionsAdd: FC = () => {
  return (
    <DashboardLayout>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <h1 className="mb-4">Add New Auction</h1>
            <CreateUpdateAuctionForm />
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}

export default DashboardAuctionsAdd
