import type { Meta, StoryObj } from '@storybook/react-native'
import { Card, Span, Table, Tbody, Td, Th, Thead, Tr } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

function TableStates () {
  return (
    <StoryStack>
      <StorySection
        title='Participant table'
        description='The table uses the shared table primitives directly so headers, rows, and cells stay explicit.'
      >
        <Card style={{ padding: 16 }}>
          <Table>
            <Thead bordered>
              <Tr>
                <Th style={{ flex: 1 }}>Name</Th>
                <Th style={{ width: 120 }}>Stage</Th>
                <Th style={{ width: 180 }}>Notes</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td style={{ flex: 1 }}>Ada Lovelace</Td>
                <Td style={{ width: 120 }}>Waiting</Td>
                <Td style={{ width: 180 }}>Missing participant number</Td>
              </Tr>
              <Tr>
                <Td style={{ flex: 1 }}>Grace Hopper</Td>
                <Td style={{ width: 120 }}>InProgress</Td>
                <Td style={{ width: 180 }}>Active matching session</Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </StorySection>
      <StorySection
        title='Ellipsis cells'
        description='Tap the long labels to expand them. This keeps the interactive ellipsis behavior visible in Storybook.'
      >
        <Card style={{ padding: 16 }}>
          <Table>
            <Thead>
              <Tr>
                <Th ellipsis style={{ width: 260 }}>This is a very long table header that should collapse</Th>
                <Th style={{ width: 120 }}>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td ellipsis style={{ width: 260 }}>
                  A very long cell value that can be expanded when tapped in the web story
                </Td>
                <Td style={{ width: 120 }}>42</Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </StorySection>
      <Span description>
        Headers and cells are kept separate so Playwright can reason about the table structure without brittle selectors.
      </Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Data/Table',
  component: TableStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof TableStates>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => <TableStates />
}
