/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { AutoSuggest, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'hedy', label: 'Hedy Lamarr' }
]

function AutoSuggestStates () {
  const [value, setValue] = useState<string | null>('ada')
  const [loadingValue, setLoadingValue] = useState<string | null>(null)

  return (
    <StoryStack>
      <StorySection
        title='Search and pick'
        description='The popover opens on focus and filters options as you type.'
      >
        <AutoSuggest
          options={OPTIONS}
          value={value}
          placeholder='Search participants'
          aria-label='Participant search'
          onChange={setValue}
        />
        <Span>{`Selected participant: ${value ?? 'none'}`}</Span>
      </StorySection>
      <StorySection
        title='Loading state'
        description='Useful for async option fetching and spinner visibility.'
      >
        <AutoSuggest
          options={OPTIONS}
          value={loadingValue}
          placeholder='Loading people...'
          isLoading
          onChange={setLoadingValue}
        />
      </StorySection>
      <Span description>
        This story is mostly about overlay behavior, filtering, and keyboard navigation.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/AutoSuggest',
  component: AutoSuggestStates
} satisfies Meta<typeof AutoSuggestStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('combobox', { name: 'Loading people...' })).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <AutoSuggestStates />,
  play: async ({ canvas }) => {
    const searchInput = canvas.getByRole('combobox', { name: 'Participant search' })
    const loadingInput = canvas.getByRole('combobox', { name: 'Loading people...' })

    await expect(searchInput).toHaveAttribute('aria-expanded', 'false')
    await expect(loadingInput).toBeVisible()
    await expect(canvas.getByText('Selected participant: ada')).toBeVisible()
    await userEvent.clear(searchInput)
    await userEvent.type(searchInput, 'Gra')
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true')

    const listbox = await waitFor(() => screen.getByRole('listbox'))
    const graceOption = await waitFor(() => screen.getByRole('option', { name: 'Grace Hopper' }))
    await expect(listbox).toBeVisible()
    await expect(graceOption).toHaveAttribute('aria-selected', 'false')

    await userEvent.click(graceOption)
    await expect(canvas.getByText('Selected participant: grace')).toBeVisible()
    await expect(canvas.getByRole('progressbar')).toBeVisible()
  }
}
