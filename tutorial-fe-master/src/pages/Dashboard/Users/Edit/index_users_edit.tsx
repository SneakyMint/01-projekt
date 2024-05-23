import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Container, Row, Col, Button } from 'react-bootstrap'
import DashboardLayout from 'components/ui/DashboardLayout_UI'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'
import * as API from 'api/Api'

const DashboardUsersEdit: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery(['fetchUser'], () => API.fetchUser())

  return (
    <DashboardLayout>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <h1 className="mb-4">Edit User</h1>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <CreateUpdateUserForm defaultValues={data?.data} />
            )}
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

export default DashboardUsersEdit
