/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { DateTimePicker, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function DateTimePickerStates () {
  const [date, setDate] = useState(+new Date('2026-01-20T12:00:00Z'))
  const [time, setTime] = useState(+new Date('2026-01-20T18:30:00Z'))
  const [datetime, setDatetime] = useState(+new Date('2026-01-20T08:15:00Z'))

  return (
    <StoryStack>
      <StorySection title='Date, time and datetime'>
        <StoryStack>
          <DateTimePicker
            label='Event date'
            date={date}
            mode='date'
            onChangeDate={setDate}
          />
          <DateTimePicker
            label='Start time'
            date={time}
            mode='time'
            onChangeDate={setTime}
          />
          <DateTimePicker
            label='Start datetime'
            date={datetime}
            mode='datetime'
            onChangeDate={setDatetime}
          />
        </StoryStack>
      </StorySection>
      <Span description>
        This story checks the input shell, open state, and the different picker modes.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/DateTimePicker',
  component: DateTimePickerStates
} satisfies Meta<typeof DateTimePickerStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <DateTimePickerStates />
}
