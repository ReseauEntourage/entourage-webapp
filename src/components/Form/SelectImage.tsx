import { MenuItem } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import SelectBase, { SelectProps as SelectBaseProps } from '@material-ui/core/Select'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldError } from 'react-hook-form/dist/types'
import { helperTextError } from './helperTextErrors'

interface Option {
  image: React.ReactNode;
  value: string | number;
}

type Errors = Partial<Record<string, FieldError>>

interface SelectProps extends SelectBaseProps {
  formErrors?: Errors;
  label?: string;
  options: Option[];
}

function renderOptions(options: Option[]) {
  return options.map(({ image, value }) => (
    <MenuItem key={value} alignItems="center" value={value}>{image}</MenuItem>
  ))
}

export function SelectImage(props: SelectProps) {
  const {
    label,
    options,
    name,
    formErrors: formErrorProps,
    ...restProps
  } = props

  const formContext = useFormContext()
  const formErrors = formErrorProps || (formContext && formContext.errors)
  const formError = (formErrors && name) ? formErrors[name] : null

  const inputLabel = React.useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = React.useState(0)

  useEffect(() => {
    if (inputLabel.current) {
      setLabelWidth(inputLabel.current.offsetWidth)
    }
  }, [])

  return (
    <FormControl
      error={!!formError}
      fullWidth={restProps.fullWidth}
      margin={restProps.margin ?? 'normal'}
      variant="outlined"
    >
      {
        label && (
          <InputLabel
            ref={inputLabel}
            htmlFor="outlined-age-native-simple"
          >
            {label}
          </InputLabel>
        )
      }
      <SelectBase
        labelWidth={labelWidth}
        name={name}
        {...restProps}
      >
        <MenuItem value="">&nbsp;</MenuItem>
        {
          options.map((option) => {
            return renderOptions([option] as Option[])
          })
        }
      </SelectBase>
      {formError && (
        <FormHelperText>{helperTextError(formError)}</FormHelperText>
      )}
    </FormControl>
  )
}
