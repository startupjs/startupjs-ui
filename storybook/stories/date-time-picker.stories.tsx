/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor } from 'storybook/test'
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
            locale='en'
            testID='dtp-date-input'
            calendarTestID='dtp-date-calendar'
            onChangeDate={setDate}
          />
          <DateTimePicker
            label='Start time'
            date={time}
            mode='time'
            locale='en'
            is24Hour
            testID='dtp-time-input'
            onChangeDate={setTime}
          />
          <DateTimePicker
            label='Start datetime'
            date={datetime}
            mode='datetime'
            locale='en'
            is24Hour
            testID='dtp-datetime-input'
            calendarTestID='dtp-datetime-calendar'
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  const dateInput = canvas.getByLabelText('Event date')
  const timeInput = canvas.getByLabelText('Start time')

  await expect(dateInput).toBeVisible()
  await userEvent.click(timeInput)
  await expect(screen.getByText('18:30')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <DateTimePickerStates />,
  play: async ({ canvas, userEvent }) => {
    const dateInput = await canvas.findByTestId('dtp-date-input')
    const timeInput = await canvas.findByTestId('dtp-time-input')
    const datetimeInput = await canvas.findByTestId('dtp-datetime-input')

    await expect(dateInput).toBeVisible()
    await expect(timeInput).toBeVisible()
    await expect(datetimeInput).toBeVisible()

    await userEvent.click(dateInput)
    await waitFor(() => expect(screen.getByTestId('dtp-date-calendar')).toBeVisible())
  }
}
