import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Card, Div, Dropdown, Span } from 'startupjs-ui'
import { PERSON_OPTIONS, StorySection, StoryStack } from './helpers'

function DropdownStates () {
  const [value, setValue] = useState<string | number>('grace')

  return (
    <StoryStack>
      <StorySection
        title='Default caption'
        description='On desktop this opens as a popover. On smaller screens the same component can switch to the drawer variant.'
      >
        <Dropdown value={value} onChange={setValue} style={{ width: 280 }}>
          {PERSON_OPTIONS.map(person => (
            <Dropdown.Item
              key={person.value}
              value={person.value}
              label={person.label}
            />
          ))}
          <Dropdown.Item value='removed' label='Removed option' disabled />
        </Dropdown>
      </StorySection>
      <StorySection
        title='Custom caption'
        description='A custom caption still keeps the interactive item list and the active label in sync.'
      >
        <Dropdown value={value} onChange={setValue} style={{ width: 280 }}>
          <Dropdown.Caption variant='button' placeholder='Choose a speaker' />
          {PERSON_OPTIONS.map(person => (
            <Dropdown.Item
              key={person.value}
              value={person.value}
              label={person.label}
            />
          ))}
        </Dropdown>
      </StorySection>
      <Card style={{ padding: 16 }}>
        <Div gap={0.5}>
          <Span bold>Selected value</Span>
          <Span description>{String(value)}</Span>
        </Div>
      </Card>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/Dropdown',
  component: DropdownStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof DropdownStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <DropdownStates />
}
