import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import GpsFixedIcon from '@material-ui/icons/GpsFixed'
import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { TextField, TextFieldProps } from 'src/components/Form'
import { GoogleMapApi } from 'src/utils/misc'
import { AnyToFix } from 'src/utils/types'
import * as S from './GoogleMapLocation.styles'

export interface PlaceType {
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

export interface GoogleMapLocationValue {
  googleSessionToken: string;
  place: PlaceType;
}

export interface GoogleMapLocationProps {
  defaultValue?: string;
  includeLatLng?: boolean;
  onChange: (value: GoogleMapLocationValue) => void;
  textFieldProps: TextFieldProps;
}

export function GoogleMapLocation(props: GoogleMapLocationProps) {
  const { textFieldProps, onChange, defaultValue } = props

  const googleMap = GoogleMapApi.getInstance()

  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<PlaceType[]>([])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const onChangeAutocomplete = useCallback(async (event, place: PlaceType) => {
    if (onChange && googleMap.isReady && place) {
      onChange({
        googleSessionToken: googleMap.sessionToken.Rf,
        place,
      })
    }
  }, [onChange, googleMap])

  const fetch = useMemo(
    () => throttle((input: AnyToFix, callback: AnyToFix) => {
      if (googleMap.isReady) {
        const data = {
          input: input.input,
          sessionToken: googleMap.sessionToken,
        }
        googleMap.autoCompleteService.getPlacePredictions(data, callback)
      }
    }, 200),
    [googleMap],
  )

  useEffect(() => {
    let active = true

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
      autoComplete={true}
      defaultValue={defaultValue}
      disableOpenOnFocus={true}
      filterOptions={(x) => x}
      freeSolo={true}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      id="google-map-demo"
      includeInputInList={true}
      onChange={onChangeAutocomplete}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          fullWidth={true}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <GpsFixedIcon />
              </InputAdornment>
            ),
          }}
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
          <Grid alignItems="center" container={true}>
            <Grid item={true}>
              <S.LocationIcon />
            </Grid>
            <Grid item={true} xs={true}>
              {parts.map((part, index) => (
                // eslint-disable-next-line
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography color="textPrimary" variant="body2">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
