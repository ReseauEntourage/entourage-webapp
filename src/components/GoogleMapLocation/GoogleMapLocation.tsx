import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import { TextField, TextFieldProps } from 'src/components/Form'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import { AnyToFix } from 'src/types'
import { isSSR } from 'src/utils'

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

interface PlaceType {
  place_id: string;
  structured_formatting: {
    main_text_matched_substrings: [
      {
        length: number;
        offset: number;
      }
    ];
    secondary_text: string;
  };
}

interface OnChangeValue {
  googleSessionToken: string;
  place: PlaceType;
}

export interface GoogleMapLocationProps {
  onChange: (value: OnChangeValue) => void;
  textFieldProps: TextFieldProps;
}

const googleMapsInst = !isSSR ? (window as AnyToFix).google.maps : null

export function GoogleMapLocation(props: GoogleMapLocationProps) {
  const { textFieldProps, onChange } = props

  const autocompleteSessionToken = useRef<{ Qf: string; }>(new googleMapsInst.places.AutocompleteSessionToken())

  const classes = useStyles()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<PlaceType[]>([])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const onChangeAutocomplete = useCallback((event, place: PlaceType) => {
    if (onChange) {
      onChange({
        googleSessionToken: autocompleteSessionToken.current.Qf,
        place,
      })
    }
  }, [onChange])

  const fetch = useMemo(
    () => throttle((input: AnyToFix, callback: AnyToFix) => {
      const data = {
        input: input.input,
        sessionToken: autocompleteSessionToken.current,
      };
      (autocompleteService.current as AnyToFix).getPlacePredictions(data, callback)
    }, 200),
    [],
  )

  useEffect(() => {
    let active = true

    autocompleteService.current = new googleMapsInst.places.AutocompleteService()

    if (inputValue === '') {
      setOptions([])
      return undefined
    }

    fetch({ input: inputValue }, (results?: PlaceType[]) => {
      if (active) {
        setOptions(results || [])
      }
    })

    return () => {
      active = false
    }
  }, [inputValue, fetch])

  return (
    <Autocomplete
      id="google-map-demo"
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete={true}
      onChange={onChangeAutocomplete}
      includeInputInList={true}
      freeSolo={true}
      disableOpenOnFocus={true}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          fullWidth={true}
          onChange={handleChange}
        />
      )}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: AnyToFix) => [match.offset, match.offset + match.length]),
        )

        return (
          <Grid container={true} alignItems="center">
            <Grid item={true}>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item={true} xs={true}>
              {parts.map((part, index) => (
                // eslint-disable-next-line
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
