/* eslint-disable max-len */
import { action } from '@storybook/addon-actions'
import { withKnobs, select, boolean, text } from '@storybook/addon-knobs'
import React from 'react'
import { TransparentWrapper } from 'src/components/StorybookUtils'
import { Button } from './Button'

export default {
  title: 'Button',
  parameters: {
    component: Button,
    componentSubtitle: 'Our buttons',
  },
  decorators: [withKnobs],
}

export const standard = () => <Button>Participer</Button>

export const variant = () => <Button variant="outlined">Participer</Button>
export const sizes = () => (
  <>
    <Button size="large">Participer</Button>
    <Button size="medium">Participer</Button>
    <Button size="small">Participer</Button>
  </>
)
sizes.story = {
  parameters: { docs: { storyDescription: '3 sizes are supported.' } },
}

export const color = () => <Button color="secondary">Participer</Button>
export const loading = () => <Button loading={true}>Loading</Button>

export const knobs = () => (
  <TransparentWrapper transparentGB={true}>
    <Button color={select('Color', ['primary', 'secondary', 'default'], 'primary')} loading={boolean('Loading', false)} onClick={action('clicked on button')} size={select('Size', ['small', 'medium', 'large'], 'medium')}>{text('Label', 'Participer')}</Button>
  </TransparentWrapper>
)
