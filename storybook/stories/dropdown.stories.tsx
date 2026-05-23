import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor, within } from 'storybook/test'
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
        <Dropdown
          value={value}
          aria-label='Speaker dropdown'
          popoverTestID='speaker-dropdown-popover'
          onChange={setValue}
          style={{ width: 280 }}
        >
          {PERSON_OPTIONS.map(person => (
            <Dropdown.Item
              key={person.value}
              value={person.value}
              label={person.label}
              testID={`speaker-option-${person.value}`}
            />
          ))}
          <Dropdown.Item value='removed' label='Removed option' testID='speaker-option-removed' disabled />
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  const customTrigger = canvas.getByRole('button', { name: 'Choose a speaker' })
  await expect(canvas.getByRole('button', { name: 'Grace Hopper' })).toBeVisible()

  expect(customTrigger.querySelector('button')).toBeNull()
  await userEvent.click(customTrigger)
  await expect(screen.getByRole('listbox')).toBeVisible()
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <DropdownStates />,
  play: async ({ canvas, userEvent }) => {
    const defaultTrigger = canvas.getByRole('button', { name: 'Speaker dropdown' })
    const customTrigger = canvas.getByRole('button', { name: 'Choose a speaker' })

    await expect(defaultTrigger).toBeVisible()
    await expect(defaultTrigger).toHaveAttribute('aria-haspopup', 'listbox')
    await expect(defaultTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(customTrigger).toBeVisible()
    await expect(canvas.getByText('grace')).toBeVisible()

    await userEvent.click(defaultTrigger)
    await waitFor(() => expect(screen.getByTestId('speaker-dropdown-popover')).toBeVisible())
    const listbox = screen.getByRole('listbox')
    const adaOption = within(listbox).getByRole('option', { name: 'Ada Lovelace' })
    await expect(adaOption).toBe(screen.getByTestId('speaker-option-ada'))
    await expect(adaOption).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(adaOption)
    await waitFor(() => expect(canvas.getByText('ada')).toBeVisible())

    await userEvent.click(defaultTrigger)
    await waitFor(() => expect(screen.getByTestId('speaker-option-removed')).toBeVisible())
    await userEvent.click(screen.getByRole('option', { name: 'Removed option' }))
    await expect(canvas.getByText('ada')).toBeVisible()

    await userEvent.click(customTrigger)
    const popupItem = await waitFor(() => {
      const matches = screen.getAllByText('Hedy Lamarr')
      const popupMatch = matches.at(-1)
      expect(popupMatch).toBeDefined()
      return popupMatch as HTMLElement
    })
    await userEvent.click(popupItem)
    await waitFor(() => expect(canvas.getByText('hedy')).toBeVisible())
  }
}
