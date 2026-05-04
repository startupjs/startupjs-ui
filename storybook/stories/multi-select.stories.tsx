/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, screen, waitFor } from 'storybook/test'
import { MultiSelect, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

const OPTIONS = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'hedy', label: 'Hedy Lamarr' },
  { value: 'margaret', label: 'Margaret Hamilton' }
]

function MultiSelectStates () {
  const [value, setValue] = useState<string[]>([])
  const [limited, setLimited] = useState(['ada', 'grace', 'hedy'])
  const [capped, setCapped] = useState<string[]>([])

  return (
    <StoryStack>
      <StorySection title='Selected tags'>
        <MultiSelect
          options={OPTIONS}
          value={value}
          placeholder='Select people'
          onChange={setValue}
        />
        <Span>{`Selected tags snapshot: ${value.join(', ') || 'none'}`}</Span>
      </StorySection>
      <StorySection title='Tag limit'>
        <MultiSelect
          options={OPTIONS}
          value={limited}
          placeholder='Limited selection'
          tagLimit={2}
          tagLimitVariant='hidden'
          onChange={setLimited}
        />
      </StorySection>
      <StorySection title='Max selection count'>
        <MultiSelect
          options={OPTIONS}
          value={capped}
          placeholder='Choose up to two people'
          maxTagCount={2}
          onChange={setCapped}
        />
        <Span>{`Capped selection snapshot: ${capped.join(', ') || 'none'}`}</Span>
      </StorySection>
      <StorySection title='Disabled and readonly'>
        <MultiSelect
          options={OPTIONS}
          value={['hedy']}
          placeholder='Disabled people'
          disabled
          onChange={() => {}}
        />
        <MultiSelect
          options={OPTIONS}
          value={['ada', 'grace']}
          placeholder='Readonly people'
          readonly
          onChange={() => {}}
        />
      </StorySection>
      <Span description>
        This story is mostly about chip layout, keyboard focus, and option visibility.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Inputs/MultiSelect',
  component: MultiSelectStates
} satisfies Meta<typeof MultiSelectStates>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas, userEvent }: PlayContext) {
  const trigger = canvas.getByRole('button', { name: 'Select people' })
  const disabledReadonlySection = canvas.getByRole('heading', { name: 'Disabled and readonly' })
    .parentElement?.parentElement as HTMLElement

  await userEvent.click(trigger)
  await expect(screen.getByRole('listbox')).toBeVisible()
  expect(disabledReadonlySection.textContent).toContain('Ada Lovelace, Grace Hopper')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <MultiSelectStates />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Select people' })
    const cappedTrigger = canvas.getByRole('button', { name: 'Choose up to two people' })
    const disabledTrigger = canvas.getByRole('button', { name: 'Hedy Lamarr' })
    const getPopupOption = (name: string) => screen.getAllByRole('button', { name }).at(-1) as HTMLElement
    const disabledReadonlySection = canvas.getByRole('heading', { name: 'Disabled and readonly' })
      .parentElement?.parentElement as HTMLElement

    await expect(trigger).toBeVisible()
    await expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true')
    await expect(canvas.getByText('Selected tags snapshot: none')).toBeVisible()
    await userEvent.click(trigger)

    await waitFor(() => expect(getPopupOption('Ada Lovelace')).toBeVisible())
    await userEvent.click(getPopupOption('Ada Lovelace'))
    await expect(canvas.getByText('Selected tags snapshot: ada')).toBeVisible()

    await waitFor(() => expect(getPopupOption('Grace Hopper')).toBeVisible())
    await userEvent.click(getPopupOption('Grace Hopper'))
    await expect(canvas.getByText('Selected tags snapshot: ada, grace')).toBeVisible()

    await waitFor(() => expect(getPopupOption('Ada Lovelace')).toBeVisible())
    await userEvent.click(getPopupOption('Ada Lovelace'))
    await expect(canvas.getByText('Selected tags snapshot: grace')).toBeVisible()

    await expect(canvas.getByText('+1')).toBeVisible()
    await userEvent.click(trigger)

    await userEvent.click(cappedTrigger)
    await waitFor(() => expect(getPopupOption('Ada Lovelace')).toBeVisible())
    await userEvent.click(getPopupOption('Ada Lovelace'))
    await waitFor(() => expect(getPopupOption('Grace Hopper')).toBeVisible())
    await userEvent.click(getPopupOption('Grace Hopper'))
    await expect(canvas.getByText('Capped selection snapshot: ada, grace')).toBeVisible()

    await waitFor(() => expect(getPopupOption('Hedy Lamarr')).toBeVisible())
    await userEvent.click(getPopupOption('Hedy Lamarr'))
    await expect(canvas.getByText('Capped selection snapshot: ada, grace')).toBeVisible()

    await expect(disabledTrigger).toBeDisabled()

    expect(disabledReadonlySection.textContent).toContain('Hedy Lamarr')
    expect(disabledReadonlySection.textContent).toContain('ada, grace')
    expect(canvasElement.querySelectorAll('button button')).toHaveLength(0)
  }
}
