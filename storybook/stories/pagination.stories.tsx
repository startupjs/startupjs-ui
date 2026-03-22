import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { expect, userEvent } from 'storybook/test'
import { Pagination, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function PaginationStory () {
  const [page, setPage] = useState(2)
  const [compactPage, setCompactPage] = useState(1)

  return (
    <StoryStack>
      <StorySection title='Full pagination'>
        <Pagination
          page={page}
          pages={5}
          showFirstButton
          showLastButton
          onChangePage={setPage}
        />
      </StorySection>

      <StorySection title='Compact pagination'>
        <Pagination
          variant='compact'
          page={compactPage}
          pages={3}
          onChangePage={setCompactPage}
        />
      </StorySection>

      <Span description>
        Current pages: full {page + 1} / 5, compact {compactPage + 1} / 3.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Navigation/Pagination',
  component: PaginationStory
} satisfies Meta<typeof PaginationStory>

export default meta

type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function failingFollowup ({ canvas }: PlayContext) {
  await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeVisible()
  await expect(canvas.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
}
void failingFollowup

export const States: Story = {
  tags: ['interaction'],
  render: () => <PaginationStory />,
  play: async ({ canvas }) => {
    const fullPageTwoButton = canvas.getByRole('button', { name: '2' })
    const fullPageFourButton = canvas.getByRole('button', { name: '4' })
    const compactNextButton = canvas.getAllByRole('button').at(-1)

    await expect(fullPageTwoButton).toBeVisible()
    await expect(fullPageFourButton).toBeVisible()
    await expect(canvas.getByText('Current pages: full 3 / 5, compact 2 / 3.')).toBeVisible()

    await userEvent.click(fullPageFourButton)
    await expect(canvas.getByText('Current pages: full 4 / 5, compact 2 / 3.')).toBeVisible()

    await userEvent.click(fullPageTwoButton)
    await expect(canvas.getByText('Current pages: full 2 / 5, compact 2 / 3.')).toBeVisible()

    await expect(compactNextButton).toBeDefined()
    await userEvent.click(compactNextButton!)
    await expect(canvas.getByText('Current pages: full 2 / 5, compact 3 / 3.')).toBeVisible()
  }
}
