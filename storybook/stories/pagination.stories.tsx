import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
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

export const States: Story = {
  render: () => <PaginationStory />
}
