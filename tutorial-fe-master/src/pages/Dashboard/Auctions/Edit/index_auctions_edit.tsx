import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Container, Row, Col, Button } from 'react-bootstrap'
import DashboardLayout from 'components/ui/DashboardLayout_UI'
import CreateUpdateAuctionForm from 'components/auctions/CreateUpdateAuctionForm'
import * as API from 'api/Api'
import { useLocation } from 'react-router-dom'

const DashboardAuctionsEdit: FC = () => {
  const location = useLocation()

  console.log('EEEDIDIIITTT', location)
  return (
    <DashboardLayout>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <CreateUpdateAuctionForm defaultValues={location.state} />
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  )
}

export default DashboardAuctionsEdit
