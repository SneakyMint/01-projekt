import React, { FC } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from 'components/ui/Layout_UI'
import LoginForm from 'components/user/LoginForm'

const Login: FC = () => {
  return (
    <Layout>
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default Login
