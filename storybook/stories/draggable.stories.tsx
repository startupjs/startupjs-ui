import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Card, DragDropProvider, Draggable, Droppable, Div, Span } from 'startupjs-ui'
import { StorySection, StoryStack } from './helpers'

interface CardItem {
  id: string
  title: string
  note: string
}

interface Columns {
  todo: CardItem[]
  doing: CardItem[]
}

const INITIAL_COLUMNS: Columns = {
  todo: [
    { id: 'prep', title: 'Prepare venue', note: 'Print the table cards.' },
    { id: 'mail', title: 'Send reminders', note: 'Include the event link.' }
  ],
  doing: [
    { id: 'photo', title: 'Collect photos', note: 'Ask participants for consent.' }
  ]
}

function moveItem (
  columns: Columns,
  dragId: string,
  dropId: string,
  dropHoverId: string,
  hoverIndex: number
) {
  if (!isColumnId(dropId) || !isColumnId(dropHoverId)) return columns

  const source = columns[dropId].slice()
  const target = dropId === dropHoverId ? source : columns[dropHoverId].slice()
  const dragIndex = source.findIndex(item => item.id === dragId)
  if (dragIndex < 0) return columns

  const [item] = source.splice(dragIndex, 1)
  const nextColumns: Columns = { ...columns }

  const insertIndex = Math.max(0, Math.min(hoverIndex, target.length))
  if (dropId === dropHoverId) {
    source.splice(insertIndex > dragIndex ? insertIndex - 1 : insertIndex, 0, item)
    nextColumns[dropId] = source
    return nextColumns
  }

  target.splice(insertIndex, 0, item)
  nextColumns[dropHoverId] = target
  return nextColumns
}

function isColumnId (value: string): value is keyof Columns {
  return value === 'todo' || value === 'doing'
}

function DraggableStates () {
  const [columns, setColumns] = useState(INITIAL_COLUMNS)
  const [status, setStatus] = useState('Drag a card between columns.')

  const columnOrder = useMemo<Array<keyof Columns>>(() => ['todo', 'doing'], [])

  return (
    <StoryStack>
      <StorySection
        title='Drag and drop board'
        description='Use a pointer drag on web. The board updates when the drag ends so the story shows a realistic reorder flow.'
      >
        <DragDropProvider>
          <Div row gap={2} wrap style={{ alignItems: 'flex-start' }}>
            {columnOrder.map(columnId => (
              <Card key={columnId} style={{ width: 320, padding: 16 }}>
                <Div gap={1}>
                  <Span h4>{columnId === 'todo' ? 'To do' : 'Doing'}</Span>
                  <Droppable
                    dropId={columnId}
                    items={columns[columnId].map(item => item.id)}
                  >
                    {columns[columnId].map((item, index) => (
                      <Draggable
                        key={item.id}
                        dragId={item.id}
                        type='task'
                        style={{ marginBottom: index < columns[columnId].length - 1 ? 12 : 0 }}
                        onDragEnd={({ dragId, dropId, dropHoverId, hoverIndex }) => {
                          setColumns(current => moveItem(current, dragId, dropId, dropHoverId, hoverIndex))
                          setStatus(`Dropped ${dragId} from ${dropId} into ${dropHoverId} at ${hoverIndex}.`)
                        }}
                        onDragBegin={({ dragId }) => {
                          setStatus(`Dragging ${dragId}...`)
                        }}
                      >
                        <Card style={{ padding: 14, backgroundColor: index % 2 ? 'var(--color-bg-main-subtle-alt)' : undefined }}>
                          <Div gap={0.5}>
                            <Span bold>{item.title}</Span>
                            <Span description>{item.note}</Span>
                          </Div>
                        </Card>
                      </Draggable>
                    ))}
                  </Droppable>
                </Div>
              </Card>
            ))}
          </Div>
        </DragDropProvider>
      </StorySection>
      <Span description>{status}</Span>
    </StoryStack>
  )
}

const meta = {
  title: 'Data/Draggable',
  component: DraggableStates,
  parameters: {
    startupjsLayout: 'content'
  }
} satisfies Meta<typeof DraggableStates>

export default meta

type Story = StoryObj<typeof meta>

export const Board: Story = {
  render: () => <DraggableStates />
}
