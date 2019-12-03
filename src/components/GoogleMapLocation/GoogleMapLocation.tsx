import React, { useState, useEffect, useRef, useMemo } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import { TextField, TextFieldProps } from 'src/components/Form'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import { env } from 'src/core'
import { AnyToFix } from 'src/types'

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

interface PlaceType {
  structured_formatting: {
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
}

interface GoogleMapLocation {
  textFieldProps: TextFieldProps;
}

export function GoogleMapLocation(props: GoogleMapLocation) {
  const { textFieldProps } = props

  const classes = useStyles()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<PlaceType[]>([])
  const loaded = useRef(false)

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAP_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      )
    }

    loaded.current = true
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const fetch = useMemo(
    () => throttle((input: AnyToFix, callback: AnyToFix) => {
      (autocompleteService.current as AnyToFix).getPlacePredictions(input, callback)
    }, 200),
    [],
  )

  useEffect(() => {
    let active = true

    if (
      !autocompleteService.current
      && (window as AnyToFix).google
      && (window as AnyToFix).google.maps
      && (window as AnyToFix).google.maps.places
    ) {
      autocompleteService.current = new (window as AnyToFix).google.maps.places.AutocompleteService()
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === '') {
      setOptions([])
      return undefined
    }

    fetch({ input: inputValue }, (results?: PlaceType[]) => {
      if (active) {
        // console.log('results', results)
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
