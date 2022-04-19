import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import SelectBase, { SelectProps as SelectBaseProps } from '@material-ui/core/Select'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldError } from 'react-hook-form/dist/types'
import { helperTextError } from './helperTextErrors'

interface OptionWithoutGroup {
  label: string;
  value: string;
}

interface OptionWithGroup {
  label: string;
  options: OptionWithoutGroup[];
}

type Errors = Partial<Record<string, FieldError>>

interface SelectProps extends SelectBaseProps {
  formErrors?: Errors;
  label: string;
  options: (OptionWithGroup | OptionWithoutGroup)[];
}

function renderOptions(options: OptionWithoutGroup[]) {
  return options.map(({ label, value }) => (
    <option key={value} value={value}>{label}</option>
  ))
}

export function Select(props: SelectProps) {
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
      <InputLabel
        ref={inputLabel}
        htmlFor="outlined-age-native-simple"
      >
        {label}
      </InputLabel>
      <SelectBase
        labelWidth={labelWidth}
        name={name}
        native={true}
        {...restProps}
      >
        <option value="">&nbsp;</option>
        {
          options.map((option) => {
            const subOptions = (option as OptionWithGroup)
            if (subOptions.options) {
              return (
                <optgroup key={subOptions.label} label={subOptions.label}>
                  {renderOptions(subOptions.options as OptionWithoutGroup[])}
                </optgroup>
              )
            }

            return renderOptions([option] as OptionWithoutGroup[])
          })
        }
      </SelectBase>
      {formError && (
        <FormHelperText>{helperTextError(formError)}</FormHelperText>
      )}
    </FormControl>
  )
}
