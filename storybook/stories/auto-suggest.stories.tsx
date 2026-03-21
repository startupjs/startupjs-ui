/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
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
          onChange={setValue}
        />
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

export const States: Story = {
  render: () => <AutoSuggestStates />
}
