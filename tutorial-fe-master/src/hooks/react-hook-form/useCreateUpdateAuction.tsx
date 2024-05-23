import { yupResolver } from '@hookform/resolvers/yup'
import { AuctionType } from 'models/auction_model'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateUpdateAuctionFields {
  title: string
  description: string
  start_price: number
  end_date: string
}

interface Props {
  defaultValues?: AuctionType
}

export const useCreateUpdateAuctionForm = ({ defaultValues }: Props) => {
  const CreateUpdateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    start_price: Yup.number().required('Start price is required'),
    end_date: Yup.string()
      .test('isFuture', 'End date cant be in the past', function (value) {
        if (value === undefined) {
          return false
        }
        const today = new Date()
        const valueDate = new Date(value)
        return valueDate >= today
      })
      .required('End date is required'),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      start_price: 0,
      end_date: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateUpdateAuctionSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateAuctionForm = ReturnType<
  typeof useCreateUpdateAuctionForm
>
