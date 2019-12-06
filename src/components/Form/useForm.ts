import useFormBase from 'react-hook-form'
import { useCatchUnreadFormErrors } from './useCatchUnreadFormErrors'

export const useForm: typeof useFormBase = (config) => {
  const { errors: errorsBase, ...restForm } = useFormBase(config)
  const errors = useCatchUnreadFormErrors(errorsBase)

  return {
    errors,
    ...restForm,
  }
}
