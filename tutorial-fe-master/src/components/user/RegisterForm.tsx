import {
  RegisterUserFields,
  useRegisterForm,
} from 'hooks/react-hook-form/useRegister'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form, Card, Button, Col, Row } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'

const RegisterForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    if (!file) return
    const response = await API.register(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      const loginResponse = await API.login({
        email: data.email,
        password: data.password,
      })
      if (loginResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else if (
        loginResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(loginResponse.data.message)
        setShowError(true)
      } else {
        const formData = new FormData()
        formData.append('avatar', file, file.name)
        const fileResponse = await API.uploadAvatar(
          formData,
          loginResponse.data.id,
        )
        if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
          setApiError(fileResponse.data.message)
          setShowError(true)
        } else if (
          fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
        ) {
          setApiError(fileResponse.data.message)
          setShowError(true)
        } else {
          const userResponse = await API.fetchUser()
          if (
            userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
          ) {
            setApiError(fileResponse.data.message)
            setShowError(true)
          } else {
            authStore.login(userResponse.data)
            navigate(routes.HOME)
          }
        }
      }
    }
  })

  const handleFileError = () => {
    if (!file) setFileError(true)
    else setFileError(false)
  }

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const myfile = target.files[0]
      setFile(myfile)
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <Form className="register-form" onSubmit={onSubmit}>
          <Form.Group className="d-flex flex-column justify-content-center align-items-center mb-4">
            <FormLabel htmlFor="avatar" id="avatar-p" className="text-center">
              <Avatar round src={preview as string} alt="Avatar" size="100" />
            </FormLabel>
            <input
              onChange={handleFileChange}
              id="avatar"
              name="avatar"
              type="file"
              aria-label="Avatar"
              aria-describedby="avatar"
              className="d-none"
            />
            {fileError && (
              <div className="d-block invalid-feedback text-danger mb-2 text-center">
                Field avatar is required
              </div>
            )}
          </Form.Group>
          <Controller
            control={control}
            name="first_name"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="first_name">First Name</FormLabel>
                <Form.Control
                  {...field}
                  type="text"
                  aria-label="First name"
                  aria-describedby="first_name"
                  isInvalid={!!errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                <Form.Control
                  {...field}
                  type="text"
                  aria-label="Last name"
                  aria-describedby="last_name"
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.last_name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Form.Control
                  {...field}
                  type="email"
                  placeholder="example@gmail.com"
                  aria-label="Email"
                  aria-describedby="email"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Form.Control
                  {...field}
                  type="password"
                  placeholder="******"
                  aria-label="Password"
                  aria-describedby="password"
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field }) => (
              <Form.Group className="mb-3">
                <FormLabel htmlFor="confirm_password">
                  Confirm Password
                </FormLabel>
                <Form.Control
                  {...field}
                  type="password"
                  aria-label="Confirm password"
                  aria-describedby="confirm_password"
                  isInvalid={!!errors.confirm_password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirm_password?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">Already have an account?</p>
            <Link className="text-decoration-none" to={routes.LOGIN}>
              Login
            </Link>
          </div>
          <Button className="w-100" type="submit" onMouseUp={handleFileError}>
            Create Account
          </Button>
        </Form>
      </Card.Body>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast
            onClose={() => setShowError(false)}
            show={showError}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </Card>
  )
}

export default observer(RegisterForm)
