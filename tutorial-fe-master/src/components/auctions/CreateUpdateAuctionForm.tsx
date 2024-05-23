import {
  CreateUpdateAuctionFields,
  useCreateUpdateAuctionForm,
} from 'hooks/react-hook-form/useCreateUpdateAuction'
import { ChangeEvent, FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { AuctionType } from 'models/auction_model'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  defaultValues?: AuctionType
}

const CreateUpdateAuctionForm: FC<Props> = ({ defaultValues }) => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useCreateUpdateAuctionForm({
    defaultValues,
  })
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false)
  const [endDate, setEndDate] = useState<Date | null>(
    defaultValues ? new Date(defaultValues.end_date) : null,
  )

  const onSubmit = handleSubmit(async (data: CreateUpdateAuctionFields) => {
    const formattedData = {
      ...data,
      end_date: endDate ? endDate.toISOString() : '',
    }
    console.log('formattedData', formattedData)
    if (!defaultValues) await handleAdd(formattedData)
    else await handleUpdate(formattedData)
  })

  const handleAdd = async (data: CreateUpdateAuctionFields) => {
    if (!file) return
    const response = await API.createAuction(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      const formData = new FormData()
      formData.append('image', file, file.name)
      const fileResponse = await API.uploadAuctionImage(
        formData,
        response.data.id,
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
        navigate(`${routes.DASHBOARD_PREFIX}`)
      }
    }
  }

  const handleUpdate = async (data: CreateUpdateAuctionFields) => {
    const response = await API.updateAuction(data, defaultValues?.id as string)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      if (!file) {
        navigate(`${routes.DASHBOARD_PREFIX}/auctions`)
        return
      }
      const formData = new FormData()
      formData.append('image', file, file.name)
      const fileResponse = await API.uploadAuctionImage(
        formData,
        response.data.id,
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
        navigate(`${routes.DASHBOARD_PREFIX}/auctions`)
      }
    }
  }

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

  return (
    <>
      <Form className="auction-form" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="title">Title</FormLabel>
              <input
                {...field}
                type="text"
                aria-label="Title"
                aria-describedby="title"
                className={
                  errors.title ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.title && (
                <div className="invalid-feedback text-danger">
                  {errors.title.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="description">Description</FormLabel>
              <input
                {...field}
                type="text"
                aria-label="Description"
                aria-describedby="description"
                className={
                  errors.description
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              {errors.description && (
                <div className="invalid-feedback text-danger">
                  {errors.description.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="start_price"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="start_price">Start Price</FormLabel>
              <input
                {...field}
                type="number"
                aria-label="price"
                aria-describedby="price"
                className={
                  errors.start_price
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              {errors.start_price && (
                <div className="invalid-feedback text-danger">
                  {errors.start_price.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="end_date"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="end_date">End Date</FormLabel>
              <DatePicker
                selected={endDate}
                onChange={(date: Date) => {
                  setEndDate(date)
                  field.onChange(date.toISOString())
                }}
                showTimeSelect
                dateFormat="yyyy-MM-dd h:mm aa"
                className={
                  errors.end_date ? 'form-control is-invalid' : 'form-control'
                }
                placeholderText="Select a date and time"
              />
              {errors.end_date && (
                <div className="invalid-feedback text-danger">
                  {errors.end_date.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Form.Group className="mb-3">
          <FormLabel htmlFor="image">Auction item image</FormLabel>
          <Form.Control
            onChange={handleFileChange}
            id="image"
            name="image"
            type="file"
            aria-label="Auction image"
            aria-describedby="image"
            className={fileError ? 'form-control is-invalid' : 'form-control'}
          />
          {fileError && (
            <div className="d-block invalid-feedback text-danger mb-2">
              Field Auction image is required
            </div>
          )}
        </Form.Group>
        <Button
          className="w-100"
          type="submit"
          onMouseUp={defaultValues ? undefined : handleFileError}
        >
          {defaultValues ? 'Update auction' : 'Create new auction'}
        </Button>
      </Form>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default CreateUpdateAuctionForm
