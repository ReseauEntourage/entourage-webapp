import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import GpsFixedIcon from '@material-ui/icons/GpsFixed'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { TextField, TextFieldProps } from 'src/components/Form'
import { isSSR, assertIsDefined } from 'src/utils/misc'
import { AnyToFix, AnyCantFix } from 'src/utils/types'

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

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
  location: null | {
    lat: number;
    lng: number;
  };
  place: PlaceType;
}

export interface GoogleMapLocationProps {
  defaultValue?: string;
  includeLatLng?: boolean;
  onChange: (value: GoogleMapLocationValue) => void;
  textFieldProps: TextFieldProps;
}

async function getLocationFromPlaceId(placeId: string): Promise<{ lat: number; lng: number; }> {
  // @ts-ignore
  const geocoder = new google.maps.Geocoder()
  const loc: AnyCantFix = await new Promise((resolve: AnyCantFix) => geocoder.geocode({ placeId }, resolve))

  assertIsDefined(loc[0], 'getLocationFromPlaceId error')

  return {
    lat: loc[0].geometry.location.lat(),
    lng: loc[0].geometry.location.lng(),
  }
}

export function GoogleMapLocation(props: GoogleMapLocationProps) {
  const { textFieldProps, onChange, defaultValue, includeLatLng } = props

  const googleMapsInst = !isSSR ? (window as AnyToFix).google.maps : null

  const autocompleteSessionToken = useRef<{ Rf: string; }>(new googleMapsInst.places.AutocompleteSessionToken())

  const classes = useStyles()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<PlaceType[]>([])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  const onChangeAutocomplete = useCallback(async (event, place: PlaceType) => {
    let location: GoogleMapLocationValue['location'] = null

    if (includeLatLng) {
      location = await getLocationFromPlaceId(place.place_id)
    }

    if (onChange) {
      onChange({
        googleSessionToken: autocompleteSessionToken.current.Rf,
        place,
        location,
      })
    }
  }, [includeLatLng, onChange])

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
  }, [inputValue, fetch, googleMapsInst.places.AutocompleteService])

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
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item={true} xs={true}>
              {parts.map((part, index) => (
                // eslint-disable-next-line
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography color="textSecondary" variant="body2">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
